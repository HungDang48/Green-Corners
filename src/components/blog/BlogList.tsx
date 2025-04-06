'use client'

import React, { useState, useEffect } from 'react'
import { Container, Card, Row, Col, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './blog.css'

interface BlogPost {
  id: number
  title: string
  content: string
  author: {
    userID: string
    name: string
    profileLink: string
  }
  createdAt: string
  updatedAt: string
  imageUrl?: string
  category?: string
  tags?: string[]
}

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/BlogPost');
        const data = await response.json();
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="loading-spinner">Đang tải...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-error">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <Container className="blog-container">
      <h1 className="blog-title">Blog</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {blogPosts.map((post) => (
          <Col key={post.id}>
            <Card className="blog-card">
              {post.imageUrl && (
                <Card.Img 
                  variant="top" 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="blog-image"
                />
              )}
              <Card.Body>
                <Card.Title className="blog-post-title">{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Tác giả: {post.author.name}
                </Card.Subtitle>
                <Card.Text className="blog-post-date">
                  Ngày đăng: {formatDate(post.createdAt)}
                </Card.Text>
                <Card.Text className="blog-post-content">
                  {post.content.length > 150 
                    ? `${post.content.substring(0, 150)}...` 
                    : post.content}
                </Card.Text>
                {post.category && (
                  <div className="blog-category">
                    <span className="category-badge">{post.category}</span>
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="blog-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag-badge">{tag}</span>
                    ))}
                  </div>
                )}
                <Button 
                  variant="primary" 
                  className="read-more-btn"
                  href={`/blog/${post.id}`}
                >
                  Đọc thêm
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default BlogList 