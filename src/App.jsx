import { useState, useEffect } from 'react';
import { Bird, LogOut, MessageCircle, Repeat2, Heart, BarChart2, Loader2, UserPlus, LogIn } from 'lucide-react';
import './index.css';
import { authAPI, tweetAPI, authStorage } from './index';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    return authStorage.getToken() ? 'dashboard' : 'login';
  });
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [status, setStatus] = useState('Checking...');
  const [content, setContent] = useState('');

  useEffect(() => {
    const token = authStorage.getToken();
    const savedUser = localStorage.getItem('auth_user');

    if (token && savedUser) {
      setAuthUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    } else {
      setCurrentView('login');
    }
  }, []);

  const handleAuth = async (type) => {
    if (!formData.email || !formData.password || (type === 'register' && !formData.name)) {
      return alert("Isi formnya yang lengkap woy!");
    }
    
    setIsSubmitting(true);
    
    try {
      const data = type === 'register'
        ? await authAPI.register(formData.name, formData.email, formData.password)
        : await authAPI.login(formData.email, formData.password);

      if (data.success) {
        if (data.token) authStorage.setToken(data.token);
        const userPayload = {
          name: data.data?.name || formData.name || 'User',
          email: data.data?.email || formData.email,
          token: data.token || authStorage.getToken() || ''
        };

        setAuthUser(userPayload);
        localStorage.setItem('auth_user', JSON.stringify(userPayload));
        setFormData({ name: '', email: '', password: '' });
        setCurrentView('dashboard');
      } else {
        alert(data.message || "Gagal Autentikasi! Cek email/password lu.");
      }
    } catch (err) {
      alert("Gagal konek ke backend! Server Express udah nyala belom?");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTimeline = async () => {
    setStatus('Fetching...');
    try {
      const data = await tweetAPI.timeline();
      setStatus('ONLINE');
      if (data.success && data.data) setTweets(data.data);
      else setTweets([]);
    } catch (error) {
      setStatus('OFFLINE');
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentView === 'dashboard' && authUser) fetchTimeline();
  }, [currentView, authUser]);

  const postTweet = async () => {
    if (!content) return;
    setIsSubmitting(true);
    
    try {
      const data = await tweetAPI.create(content);

      if (!data.success) {
        alert(data.message || 'Gagal nge-tweet!');
        return;
      }

      setContent(''); 
      fetchTimeline(); 
    } catch (err) {
      alert("Gagal nge-tweet!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const likeTweet = async (id) => {
    try {
      await tweetAPI.like(id);
      fetchTimeline(); 
    } catch (err) {
      console.error("Like failed", err);
    }
  };
  if (currentView === 'login' || currentView === 'register') {
    const isLogin = currentView === 'login';
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-darkbg text-white">
        <div className="bg-cardbg border border-bordercolor p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="text-center mb-8 flex flex-col items-center">
            <Bird className="text-brand w-12 h-12 mb-4" />
            <h1 className="text-2xl font-bold">{isLogin ? 'Log in to Chirp' : 'Join Chirp Today'}</h1>
          </div>
          
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <input 
                  type="text" placeholder="Full Name" 
                  className="w-full bg-darkbg border border-bordercolor rounded-md p-3 focus:outline-none focus:border-brand transition"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div>
              <input 
                type="email" placeholder="Email" 
                className="w-full bg-darkbg border border-bordercolor rounded-md p-3 focus:outline-none focus:border-brand transition"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <input 
                type="password" placeholder="Password" 
                className="w-full bg-darkbg border border-bordercolor rounded-md p-3 focus:outline-none focus:border-brand transition"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <button 
              onClick={() => handleAuth(currentView)}
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-full transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? <LogIn className="w-5 h-5"/> : <UserPlus className="w-5 h-5"/>)}
              {isLogin ? 'Log In' : 'Register'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => {
                setCurrentView(isLogin ? 'register' : 'login');
                setFormData({ name: '', email: '', password: '' });
              }} 
              className="text-brand hover:underline ml-1"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto border-x border-bordercolor min-h-screen relative bg-darkbg text-white shadow-2xl">
      <div className="glass-panel sticky top-0 z-10 px-4 py-3 border-b border-bordercolor flex justify-between items-center">
        <h1 className="text-xl font-bold flex items-center gap-2"><Bird className="text-brand w-6 h-6"/> Home</h1>
        <div className="flex items-center gap-4">
          <span className={status === 'ONLINE' ? 'text-green-500 text-xs font-mono font-bold' : 'text-red-500 text-xs font-mono font-bold'}>
            {status}
          </span>
          <button 
            onClick={() => { authStorage.clearToken(); localStorage.removeItem('auth_user'); setAuthUser(null); setCurrentView('login'); }} 
            className="text-sm text-gray-500 hover:text-red-400 transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 border-b border-bordercolor flex gap-4">
        <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center font-bold text-xl text-white shrink-0">
          {authUser?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="w-full">
          <textarea 
            value={content} onChange={(e) => setContent(e.target.value)}
            rows="3" placeholder="What is happening?!" 
            className="w-full bg-transparent resize-none border-none focus:ring-0 text-xl placeholder-gray-500 focus:outline-none text-white mt-2"
          />
          <div className="flex justify-between items-center border-t border-bordercolor pt-3 mt-2">
            <span className="text-xs text-gray-500 font-mono">{content.length} / 280</span>
            <button 
              onClick={postTweet} disabled={isSubmitting || !content}
              className="bg-brand hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-full transition text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post'}
            </button>
          </div>
        </div>
      </div>
      <div>
        {tweets.length === 0 ? (
          <div className="text-center text-gray-500 py-10 flex flex-col items-center justify-center">
            {status === 'Fetching...' ? <Loader2 className="w-8 h-8 animate-spin mb-2" /> : 'Belum ada tweet. Jadilah yang pertama!'}
          </div>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet.id} className="p-4 border-b border-bordercolor hover:bg-cardbg transition flex gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-lg font-bold text-gray-300 uppercase">
                {tweet.author ? tweet.author.charAt(0) : '?'}
              </div>
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white">{tweet.author}</span>
                  <span className="text-gray-500 text-sm">@{tweet.email?.split('@')[0]}</span>
                </div>
                <p className="text-white mb-3 text-[15px] leading-normal whitespace-pre-wrap">{tweet.content}</p>
                
                <div className="flex justify-between text-gray-500 text-sm max-w-md">
                  <button className="hover:text-brand transition flex items-center gap-2 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-900/30"><MessageCircle className="w-4 h-4" /></div>
                  </button>
                  <button className="hover:text-green-500 transition flex items-center gap-2 group">
                    <div className="p-2 rounded-full group-hover:bg-green-900/30"><Repeat2 className="w-4 h-4" /></div>
                  </button>
                  <button onClick={() => likeTweet(tweet.id)} className="hover:text-pink-500 transition flex items-center gap-2 group">
                    <div className="p-2 rounded-full group-hover:bg-pink-900/30"><Heart className="w-4 h-4" /></div>
                    <span>{tweet.likes || 0}</span>
                  </button>
                  <button className="hover:text-brand transition flex items-center gap-2 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-900/30"><BarChart2 className="w-4 h-4" /></div>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}