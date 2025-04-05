import FeaturedPosts from "@/components/featured-posts/FeaturedPosts";
import Banner from "@/components/banner/Banner";
import { Button } from "antd";

export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedPosts />
    </div>
  );
}
