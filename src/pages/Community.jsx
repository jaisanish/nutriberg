import { useState } from 'react';
import { getAllRecipes } from '../data/recipes';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';
import SearchBar from '../components/SearchBar';
import { Users, TrendingUp, Award, MessageCircle, ThumbsUp, Heart, Send } from 'lucide-react';

export default function Community() {
  const { posts, addPost, toggleLike, addComment } = useCommunity();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [search, setSearch] = useState('');
  
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});

  const recipes = getAllRecipes();
  const topRated = [...recipes].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const newest = [...recipes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  const handleAddPost = (e) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      addPost(newPostContent);
      setNewPostContent('');
    }
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (text?.trim()) {
      addComment(postId, text);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><Users size={28} style={{ verticalAlign: 'middle', marginRight: 'var(--space-sm)' }} />Community</h1>
        <p>Share recipes, discover favorites, and connect with fellow food lovers</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-4 mb-xl">
        <div className="glass-card-static text-center">
          <Users size={24} color="var(--primary-light)" />
          <div className="font-bold text-lg mt-sm">{posts.map(p => p.author.name).filter((v,i,a) => a.indexOf(v)===i).length || 1}</div>
          <div className="text-xs text-muted">Active Members</div>
        </div>
        <div className="glass-card-static text-center">
          <MessageCircle size={24} color="var(--secondary-light)" />
          <div className="font-bold text-lg mt-sm">{posts.length}</div>
          <div className="text-xs text-muted">Discussions</div>
        </div>
        <div className="glass-card-static text-center">
          <Award size={24} color="var(--accent-light)" />
          <div className="font-bold text-lg mt-sm">{recipes.length}</div>
          <div className="text-xs text-muted">Shared Recipes</div>
        </div>
        <div className="glass-card-static text-center">
          <TrendingUp size={24} color="#60a5fa" />
          <div className="font-bold text-lg mt-sm">{posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0)}</div>
          <div className="text-xs text-muted">Total Comments</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-xl">
        <button className={`tab ${activeTab === 'discussions' ? 'active' : ''}`} onClick={() => setActiveTab('discussions')}>
          💬 Discussions
        </button>
        <button className={`tab ${activeTab === 'trending' ? 'active' : ''}`} onClick={() => setActiveTab('trending')}>
          🔥 Trending
        </button>
        <button className={`tab ${activeTab === 'top-rated' ? 'active' : ''}`} onClick={() => setActiveTab('top-rated')}>
          ⭐ Top Rated
        </button>
        <button className={`tab ${activeTab === 'newest' ? 'active' : ''}`} onClick={() => setActiveTab('newest')}>
          🆕 Newest
        </button>
      </div>

      {/* Trending / Top Rated / Newest */}
      {(activeTab === 'trending' || activeTab === 'top-rated' || activeTab === 'newest') && (
        <div className="animate-fade-in">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search community recipes..."
            showFilterBtn={false}
          />
          <div className="grid grid-3 mt-lg">
            {(activeTab === 'top-rated' ? topRated : activeTab === 'newest' ? newest : recipes.slice(0, 6))
              .filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
              .map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={i} />
              ))}
          </div>
        </div>
      )}

      {/* Discussions */}
      {activeTab === 'discussions' && (
        <div className="animate-fade-in flex flex-col gap-md">
          {user && (
            <form className="glass-card mb-md flex gap-sm" onSubmit={handleAddPost}>
              <div className="comment-avatar" style={{ width: 40, height: 40, fontSize: '1rem', flexShrink: 0 }}>
                {user.avatar}
              </div>
              <input 
                className="input" 
                style={{ flex: 1, borderRadius: 'var(--radius-full)' }} 
                placeholder="Share a recipe, tip, or ask a question..." 
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', padding: '0 var(--space-lg)' }}>Post</button>
            </form>
          )}

          {posts.map(post => (
            <div key={post.id} className="glass-card">
              <div className="flex gap-md">
                <div className="comment-avatar" style={{ width: 44, height: 44, fontSize: '0.85rem' }}>
                  {post.author.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-sm mb-sm">
                    <span className="font-semibold">{post.author.name}</span>
                    <span className="text-xs text-muted">• {new Date(post.timestamp).toLocaleDateString()}</span>
                  </div>
                  {post.title && <h4 className="mb-sm">{post.title}</h4>}
                  <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      style={{
                        width: '100%', maxHeight: 200, objectFit: 'cover',
                        borderRadius: 'var(--radius-md)', marginTop: 'var(--space-md)',
                      }}
                    />
                  )}
                  <div className="flex items-center gap-lg mt-md">
                    <button 
                      className={`btn btn-ghost btn-sm ${post.likedBy?.includes(user?.id) ? 'active' : ''}`} 
                      style={{ gap: '6px', color: post.likedBy?.includes(user?.id) ? 'var(--danger-light)' : 'inherit' }}
                      onClick={() => toggleLike(post.id)}
                    >
                      <Heart size={16} fill={post.likedBy?.includes(user?.id) ? 'currentColor' : 'none'} /> {post.likes}
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ gap: '6px' }}>
                      <MessageCircle size={16} /> {post.comments?.length || 0}
                    </button>
                  </div>
                  
                  {/* Comments Section */}
                  {(post.comments?.length > 0 || user) && (
                    <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--glass-border)' }}>
                      {post.comments?.map(comment => (
                        <div key={comment.id} className="flex gap-sm mb-sm text-sm">
                          <span className="font-bold">{comment.author}</span>
                          <span className="text-secondary">{comment.text}</span>
                        </div>
                      ))}
                      
                      {user && (
                        <form className="flex gap-sm mt-sm" onSubmit={(e) => handleAddComment(post.id, e)}>
                          <input 
                            className="input input-sm" 
                            style={{ flex: 1, borderRadius: 'var(--radius-full)', background: 'var(--glass-bg)' }}
                            placeholder="Write a comment..." 
                            value={commentInputs[post.id] || ''}
                            onChange={e => setCommentInputs(prev => ({...prev, [post.id]: e.target.value}))}
                          />
                          <button type="submit" className="btn btn-ghost btn-sm"><Send size={16} /></button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
