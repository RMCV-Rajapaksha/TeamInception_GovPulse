import Trending from "../../components/sections/Trending";
import PostCard from "../../components/posts/PostCard";
import type { Post } from "../../components/posts/PostCard";

export default function HomePage() {
  const trendingItems = [
    {
      id: "1",
      title: "Trains delayed on several lines",
      imageUrl: "/trending/img1.png",
    },
    {
      id: "2",
      title: "A drinking water crisis in Welikanda",
      imageUrl: "/trending/img2.png",
    },
    {
      id: "3",
      title:
        "Madampitiya landfill a 'serious threat' to the environment and health.",
      imageUrl: "/trending/img3.png",
    },
    {
      id: "4",
      title: "A drinking water crisis in Welikanda",
      imageUrl: "/trending/img4.png",
    },
    {
      id: "5",
      title: "A drinking water crisis in Welikanda",
      imageUrl: "/trending/img1.png",
    },
  ];

  const posts: Post[] = [
    {
      id: "p1",
      title: "Severely Damaged Road Near Matugama Town",
      description:
        "The main access road leading into Matugama town from the southern expressway has been severely damaged for over six months. Multiple large potholes, broken tarmac, and poor drainage have made the road nearly unusable during heavy rains. Local residents and daily commuters report frequent accidents and vehicle breakdowns.",
      date: "July 22, 2025",
      location: "Matugama, Kalutara",
      votes: 386,
      status: "Pending",
      imageUrl: "/post/post1.jpg",
    },
    {
      id: "p2",
      title: "Cracked Walls at Ranabima College",
      description:
        "Several buildings at Ranabima Royal College have fallen into a state of disrepair. Leaking roofs, exposed wiring, and visible cracks in classroom walls are affecting the safety of students.",
      date: "July 30, 2025",
      location: "Gampola, Kandy",
      votes: 237,
      status: "Pending",
      imageUrl: "/post/post2.jpg",
    },
    {
      id: "p3",
      title: "Cracked Walls at Ranabima College",
      description:
        "Several buildings at Ranabima Royal College have fallen into a state of disrepair. Leaking roofs, exposed wiring, and visible cracks in classroom walls are affecting the safety of students.",
      date: "July 30, 2025",
      location: "Gampola, Kandy",
      votes: 237,
      status: "Pending",
      imageUrl: "/post/post2.jpg",
    },
  ];

  return (
    <div className="pb-24 md:ml-[14rem] px-10 md:px-0 md:pl-[2rem] md:pr-[10rem]">
      <Trending items={trendingItems} />
      <div className=" w-full mt-10 h-1">
        <div className="border-t border-gray-200" />
      </div>
      <div className="mt-6 divide-y divide-gray-200">
        {posts.map((post) => (
          <div key={post.id} className="py-4">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}
