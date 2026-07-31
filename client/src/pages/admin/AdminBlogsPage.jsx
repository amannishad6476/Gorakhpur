import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/axiosInstance';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Tips & Tricks', 'Interior Design', 'Painting Guide', 'Paint Brands', 'Home Improvement', 'Color Ideas', 'Maintenance', 'News'];

const emptyForm = { title: '', slug: '', excerpt: '', content: '', coverImage: '', author: 'Munnalal Painter', category: 'Tips & Tricks', tags: '', metaTitle: '', metaDescription: '', isPublished: false };

const BlogForm = ({ initial, onSave, onCancel, loading }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const autoSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold text-[var(--color-text)] mb-5">{initial?._id ? 'Edit Blog Post' : 'New Blog Post'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Title *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.title} onChange={e => { set('title', e.target.value); if (!initial?._id) set('slug', autoSlug(e.target.value)); }} placeholder="Blog post title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Slug *</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="url-friendly-slug" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Category</label>
          <select className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Excerpt *</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={2} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short description for the blog post" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Content (HTML) *</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm font-mono" rows={10} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.content} onChange={e => set('content', e.target.value)} placeholder="Write blog content in HTML or plain text..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Cover Image URL</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.coverImage} onChange={e => set('coverImage', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Author</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.author} onChange={e => set('author', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Tags (comma separated)</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="painting, gorakhpur, interior" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Meta Title</label>
          <input className="w-full px-3 py-2 rounded-lg border text-sm" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="SEO title" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Meta Description</label>
          <textarea className="w-full px-3 py-2 rounded-lg border text-sm" rows={2} style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="SEO meta description (150-160 chars)" />
        </div>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isPublished} onChange={e => set('isPublished', e.target.checked)} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4a017]"></div>
            <span className="ml-3 text-sm font-medium text-[var(--color-text)]">Publish</span>
          </label>
        </div>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={() => onSave(form)} disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Blog Post'}</button>
        <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
      </div>
    </div>
  );
};

const AdminBlogsPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: () => api.get('/blogs/admin/all').then(r => r.data.data),
  });

  const create = useMutation({
    mutationFn: (body) => api.post('/blogs', { ...body, tags: body.tags ? body.tags.split(',').map(t => t.trim()) : [] }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-blogs']); toast.success('Blog post created!'); setShowForm(false); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to create'),
  });

  const update = useMutation({
    mutationFn: ({ id, body }) => api.put(`/blogs/${id}`, { ...body, tags: body.tags ? (Array.isArray(body.tags) ? body.tags : body.tags.split(',').map(t => t.trim())) : [] }),
    onSuccess: () => { queryClient.invalidateQueries(['admin-blogs']); toast.success('Blog updated!'); setEditing(null); },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/blogs/${id}`),
    onSuccess: () => { queryClient.invalidateQueries(['admin-blogs']); toast.success('Deleted!'); },
  });

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-surface)' }}>
      <AdminSidebar />
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text)]">Blog Posts</h1>
            <p className="text-[var(--color-text-muted)] mt-1">{data?.length || 0} total posts</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditing(null); }} className="btn-primary text-sm">+ New Post</button>
        </div>

        <AnimatePresence>
          {(showForm || editing) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-6">
              <BlogForm
                initial={editing ? { ...editing, tags: Array.isArray(editing.tags) ? editing.tags.join(', ') : editing.tags } : null}
                onSave={(form) => editing ? update.mutate({ id: editing._id, body: form }) : create.mutate(form)}
                onCancel={() => { setShowForm(false); setEditing(null); }}
                loading={create.isPending || update.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? <LoadingSpinner /> : (
          <div className="space-y-3">
            {data?.map((blog, i) => (
              <motion.div key={blog._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {blog.coverImage && (
                    <img src={blog.coverImage} alt={blog.title} className="w-16 h-12 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-[var(--color-text)] text-sm truncate">{blog.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${blog.isPublished ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{blog.category} · {blog.views} views · {new Date(blog.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200">View</a>
                  <button onClick={() => { setEditing(blog); setShowForm(false); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200">Edit</button>
                  <button onClick={() => { if (window.confirm('Delete this blog?')) del.mutate(blog._id); }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">Delete</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogsPage;
