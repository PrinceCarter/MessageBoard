import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Failed to fetch user:", error.message);
        } else {
          setUser(data?.user || null);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch posts after user is fetched
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;

      setLoadingPosts(true);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("author_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch user posts:", error.message);
        } else {
          setPosts(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchUserPosts();
  }, [user]);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Failed to sign out:", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <VStack className="p-4" space="lg">
        {/* User Info */}
        {loadingUser ? (
          <HStack space="md" className="items-center animate-pulse">
            <Box className="bg-gray-200 rounded-full h-16 w-16" />
            <VStack space="sm">
              <Box className="bg-gray-200 h-5 w-32 rounded-md" />
              <Box className="bg-gray-200 h-4 w-24 rounded-md" />
            </VStack>
          </HStack>
        ) : (
          <HStack space="md" className="items-center">
            <Avatar size="lg">
              {user?.user_metadata?.avatar ? (
                <AvatarImage source={{ uri: user.user_metadata.avatar }} />
              ) : (
                <AvatarFallbackText>
                  {`${user?.user_metadata?.first_name?.[0]}${user?.user_metadata?.last_name?.[0]}`}
                </AvatarFallbackText>
              )}
            </Avatar>
            <VStack>
              <Heading size="md">
                {user?.user_metadata?.first_name}{" "}
                {user?.user_metadata?.last_name}
              </Heading>
              <Text size="sm" className="text-gray-500">
                Joined:{" "}
                {new Date(user?.created_at || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </VStack>
          </HStack>
        )}

        {/* Logout Button */}
        <Button
          size="lg"
          onPress={onLogout}
          className="bg-red-600 hover:bg-red-700"
        >
          <ButtonText className="text-white">Logout</ButtonText>
        </Button>
      </VStack>

      {/* User Posts */}
      <ScrollView className="flex-1">
        <VStack space="md" className="p-4">
          <Heading size="xl">Your Posts</Heading>
          {loadingPosts ? (
            Array(3)
              .fill(null)
              .map((_, index) => (
                <Box
                  key={index}
                  className="bg-gray-200 rounded-lg p-4 animate-pulse h-72"
                />
              ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                content={post.content}
                createdAt={post.created_at}
                authorName={`${user?.user_metadata?.first_name} ${user?.user_metadata?.last_name}`}
                avatar={user?.user_metadata?.avatar}
              />
            ))
          ) : (
            <Text className="text-center text-gray-500">No posts yet!</Text>
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
