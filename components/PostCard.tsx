import React from "react";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";

interface PostCardProps {
  content: string;
  createdAt: string;
  authorName: string;
  avatar: string;
}

const PostCard: React.FC<PostCardProps> = ({
  content,
  createdAt,
  authorName,
  avatar,
}) => {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(createdAt));
  return (
    <Card className="p-5 rounded-lg border border-gray-200">
      <Text className="text-sm font-normal mb-2 text-typography-700">
        {formattedDate}
      </Text>
      <VStack>
        <Heading size="md" className="mb-4">
          {content}
        </Heading>
      </VStack>
      <Box className="flex-row items-center">
        <Avatar className="mr-3">
          <AvatarFallbackText>{authorName}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: avatar || "https://via.placeholder.com/150",
            }}
            alt="Avatar"
          />
        </Avatar>
        <Heading size="sm">{authorName}</Heading>
      </Box>
    </Card>
  );
};

export default PostCard;
