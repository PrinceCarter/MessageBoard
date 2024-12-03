import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { MaterialIcons } from "@expo/vector-icons";
import PostCard from "@/components/PostCard";
import NewPostModal from "@/components/NewPostModal";
import { supabase } from "@/lib/supabase";

interface Post {
  id: string;
  content: string;
  author_id: string;
  created_at: string;
  authorName?: string;
  avatar?: string;
}

interface PostPayload {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Post | null;
  old: Post | null;
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPostsWithUserDetails = async () => {
    try {
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Failed to fetch posts:", postsError.message);
        return;
      }

      const postsWithUserDetails = await Promise.all(
        posts.map(async (post) => {
          const { data: user, error: userError } = await supabase
            .from("users")
            .select("first_name, last_name, avatar")
            .eq("id", post.author_id)
            .single();

          if (userError) {
            console.error(
              `Failed to fetch user for post ${post.id}:`,
              userError.message
            );
          }

          return {
            ...post,
            authorName: user
              ? `${user.first_name} ${user.last_name}`
              : "Unknown User",
            avatar: user?.avatar || null,
          };
        })
      );

      setPosts(postsWithUserDetails);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const enrichPostWithUserDetails = async (post: Post): Promise<Post> => {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("first_name, last_name, avatar")
      .eq("id", post.author_id)
      .single();

    if (userError) {
      console.error(
        `Failed to fetch user for post ${post.id}:`,
        userError.message
      );
    }

    return {
      ...post,
      authorName: user
        ? `${user.first_name} ${user.last_name}`
        : "Unknown User",
      avatar: user?.avatar || null,
    };
  };

  useEffect(() => {
    fetchPostsWithUserDetails();

    // Subscribe to real-time updates for all changes
    const subscription = supabase
      .channel("realtime:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        async (payload: PostPayload) => {
          const { eventType, new: newPost, old: oldPost } = payload;

          if (eventType === "INSERT" && newPost) {
            const enrichedPost = await enrichPostWithUserDetails(newPost);
            setPosts((prev) => [enrichedPost, ...prev]);
          } else if (eventType === "UPDATE" && newPost) {
            const enrichedPost = await enrichPostWithUserDetails(newPost);
            setPosts((prev) =>
              prev.map((post) =>
                post.id === enrichedPost.id ? enrichedPost : post
              )
            );
          } else if (eventType === "DELETE" && oldPost) {
            setPosts((prev) => prev.filter((post) => post.id !== oldPost.id));
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <Box className="py-4 px-4">
        <Heading size="2xl" className="text-black">
          Message Board
        </Heading>
      </Box>

      <ScrollView className="flex-1">
        <VStack space="md" className="p-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Box
                key={index}
                className="bg-background-200 p-4 rounded-lg animate-pulse h-72"
              />
            ))
          ) : posts.length === 0 ? (
            <Heading size="lg" className="text-black">
              No posts available. Be the first to create one!
            </Heading>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                content={post.content}
                createdAt={post.created_at}
                authorName={post.authorName || "Unknown Author"}
                avatar={post.avatar || ""}
              />
            ))
          )}
        </VStack>
      </ScrollView>

      {/* FAB */}
      <Box>
        <Fab
          size="lg"
          placement="bottom right"
          className="absolute bottom-20 right-6 bg-primary-600 hover:bg-primary-700"
          onPress={() => setModalVisible(true)}
        >
          <FabIcon
            as={() => <MaterialIcons name="add" size={24} color="white" />}
          />
          <FabLabel className="text-white font-bold">New Post</FabLabel>
        </Fab>
      </Box>

      {/* Modal for Creating Post */}
      <NewPostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
