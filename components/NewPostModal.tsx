import React, { useState } from "react";
import { Modal, SafeAreaView } from "react-native";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

export default function NewPostModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddPost = async () => {
    if (newPostContent.trim() === "") return;
  
    setLoading(true);
  
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      if (!session) {
        console.error("User not authenticated");
        return;
      }
  
      // Use Supabase client SDK to insert the new post
      const { data, error } = await supabase
        .from("posts")
        .insert([{ content: newPostContent, author_id: session.user.id }]);
  
      if (error) {
        console.error("Error adding post:", error.message);
      } else {
        setNewPostContent("");
        onClose();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView className="flex-1 mx-4">
        <HStack space="md" className="mb-4 items-center">
          <MaterialIcons name="close" size={24} onPress={onClose} />
          <Heading size="lg">Create a New Post</Heading>
        </HStack>
        <Box className="flex-1 p-4">
          <Input>
            <InputField
              placeholder="Type your post here..."
              value={newPostContent}
              onChangeText={setNewPostContent}
            />
          </Input>
          <HStack space="sm" className="mt-4 justify-end">
            <Button
              onPress={onClose}
              className="bg-gray-200 text-black px-4 py-2 rounded-lg"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleAddPost}
              disabled={loading}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg"
            >
              {loading ? (
                <ButtonText>Posting...</ButtonText>
              ) : (
                <ButtonText>Post</ButtonText>
              )}
            </Button>
          </HStack>
        </Box>
      </SafeAreaView>
    </Modal>
  );
}
