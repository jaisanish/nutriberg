import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CommunityContext = createContext(null);
const STORAGE_KEY = 'nutriberg_community_posts';

const initialPosts = [
  {
    id: 'p1',
    author: { name: 'Sarah Jenkins', avatar: 'S' },
    content: 'Just tried the Avocado Toast recipe from the explore page. Added a pinch of red pepper flakes and it was absolutely incredible! 🔥',
    likes: 24,
    likedBy: [],
    comments: [
      { id: 'c1', author: 'Mike T.', text: 'Red pepper flakes are a game changer!' }
    ],
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'p2',
    author: { name: 'David Chen', avatar: 'D' },
    content: 'Hit my protein goal 7 days in a row! Meal prep is the secret. Anyone have good high-protein vegetarian recipes?',
    likes: 15,
    likedBy: [],
    comments: [],
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export function CommunityProvider({ children }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialPosts;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const addPost = (content) => {
    if (!user) return;
    const newPost = {
      id: `post_${Date.now()}`,
      author: { name: user.name, avatar: user.avatar },
      content,
      likes: 0,
      likedBy: [],
      comments: [],
      timestamp: new Date().toISOString()
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLike = (postId) => {
    if (!user) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = p.likedBy.includes(user.id);
        return {
          ...p,
          likes: isLiked ? p.likes - 1 : p.likes + 1,
          likedBy: isLiked ? p.likedBy.filter(id => id !== user.id) : [...p.likedBy, user.id]
        };
      }
      return p;
    }));
  };

  const addComment = (postId, text) => {
    if (!user) return;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: `c_${Date.now()}`, author: user.name, text }]
        };
      }
      return p;
    }));
  };

  return (
    <CommunityContext.Provider value={{ posts, addPost, toggleLike, addComment }}>
      {children}
    </CommunityContext.Provider>
  );
}

export const useCommunity = () => useContext(CommunityContext);
