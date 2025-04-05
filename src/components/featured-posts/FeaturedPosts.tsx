import React from 'react';
import './FeaturedPosts.css';

interface Post {
  id: number;
  title: string;
  summary: string;
  thumbnail: string;
  author: string;
  date: string;
}

const featuredPosts: Post[] = [
  {
    id: 1,
    title: "10 Bí Quyết Để Viết Blog Hiệu Quả",
    summary: "Khám phá những bí quyết giúp bạn viết blog chuyên nghiệp và thu hút độc giả...",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Nguyễn Văn A",
    date: "15 Tháng 3, 2024"
  },
  {
    id: 2,
    title: "SEO Cho Blog: Hướng Dẫn Từ A Đến Z",
    summary: "Tìm hiểu các kỹ thuật SEO cơ bản đến nâng cao để tối ưu hóa blog của bạn...",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Trần Thị B",
    date: "14 Tháng 3, 2024"
  },
  {
    id: 3,
    title: "Cách Tạo Nội Dung Viral Trên Mạng Xã Hội",
    summary: "Những chiến lược hiệu quả để tạo nội dung thu hút và lan tỏa trên mạng xã hội...",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    author: "Lê Văn C",
    date: "13 Tháng 3, 2024"
  }
];

const FeaturedPosts: React.FC = () => {
  return (
    <section className="featured-posts">
      <div className="featured-posts-container">
        <h2 className="section-title">Bài Viết Nổi Bật</h2>
        <div className="featured-posts-grid">
          {featuredPosts.map((post) => (
            <article key={post.id} className="featured-post-card">
              <div className="post-thumbnail">
                <img src={post.thumbnail} alt={post.title} />
              </div>
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-summary">{post.summary}</p>
                <div className="post-meta">
                  <span className="post-author">
                    <i className="fas fa-user"></i> {post.author}
                  </span>
                  <span className="post-date">
                    <i className="fas fa-calendar"></i> {post.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts; 