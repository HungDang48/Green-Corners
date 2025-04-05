'use client'

import { NavDropdown } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

const BlogDropdown = () => {
  return (
    <NavDropdown 
      title="BLOG" 
      id="blog-dropdown"
      className="nav-dropdown"
    >
      <NavDropdown.Item href="/blog/tech">Công Nghệ</NavDropdown.Item>
      <NavDropdown.Item href="/blog/lifestyle">Lifestyle</NavDropdown.Item>
      <NavDropdown.Item href="/blog/food">Ẩm Thực</NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item href="/blog/all">Tất Cả Bài Viết</NavDropdown.Item>
    </NavDropdown>
  )
}

export default BlogDropdown 