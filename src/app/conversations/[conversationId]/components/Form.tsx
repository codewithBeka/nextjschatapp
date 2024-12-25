"use client";

import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { CldUploadButton } from "next-cloudinary";
import useConversation from "@/hooks/useConversation";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";

const Form = () => {
  const { conversationId } = useConversation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  const handleUpload = (result: any) => {
    try {
      const response = axios.post("/api/messages", {
        image: result.info.secure_url,
        conversationId: conversationId,
      });
      // Handle success, e.g., update UI or notify user
    } catch (error) {
      console.error("Upload error:", error);
      // Handle error, e.g., notify user
    }
  };
  const onEmojiClick = (emojiObject: EmojiClickData, event: MouseEvent) => {
    console.log("Event:", event); // Log the event to see if it's firing correctly
    console.log("Emoji Object:", emojiObject); // Check if emojiObject is correctly passed

    if (emojiObject && emojiObject.emoji) {
      const currentMessage = getValues("message"); // Get current value from the form
      setValue("message", currentMessage + emojiObject.emoji); // Append the emoji
      console.log("Current message:", currentMessage); // Log the current message
      console.log("New message:", currentMessage + emojiObject.emoji); // Log the new message
    } else {
      console.error("Emoji object is undefined or does not contain an emoji.");
    }

    setShowEmojiPicker(false); // Close the emoji picker
  };

  return (
    <div
      className="
        py-4 
        px-4 
        bg-white 
        border-t 
        flex 
        items-center 
        gap-2 
        lg:gap-4 
        w-full
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onSuccess={handleUpload}
        uploadPreset="chatapp"
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        <span role="img" aria-label="emoji" className="text-sky-500">
          😀
        </span>
      </button>

      {showEmojiPicker && (
        <div style={{ position: "absolute", bottom: "60px", right: "20px" }}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          type="submit"
          className="
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
