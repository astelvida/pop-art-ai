"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { generatePopArtImage } from '@/ai/generate-image';
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const form = useForm({
    defaultValues: {
      sceneDescription: "A superhero soaring through a futuristic cityscape, cape billowing in the wind.",
      mood: "energetic"
    }
  });

  const onSubmit = async (data: { sceneDescription: string; mood: string }) => {
    const generatedImage = await generatePopArtImage(`${data.sceneDesncription} with a ${data.mood} mood`);
    console.log(generatedImage);
    setImage(generatedImage);
  };


  const prompts = [
    "A pop art comic book image in SPELL style of a woman standing alone in a dimly lit room, tears streaming down her face as she clutches a broken mirror. Speech bubble: 'How did it all go wrong?'",
    "A pop art comic book image in SPELL style of a man and woman in a heated argument, the man turning away in anger while the woman shouts, 'You never listened!' Their broken relationship is the focus.",
    "A pop art comic book image in SPELL style of a young woman staring out a rainy window, her reflection distorted by tears. Speech bubble: 'It’s always the same, isn’t it?' Sadness and despair fill the scene.",
    "A dark pop art comic book image in SPELL style of a man kneeling on the floor, holding his head in his hands, overwhelmed by his own thoughts. Speech bubble: 'I can’t take this anymore!'",
    "A pop art comic book image in SPELL style of two young lovers saying goodbye at a train station, the train’s shadow casting a line between them. Speech bubble: 'Goodbye forever.' Their faces are filled with regret.",
    "A pop art comic book image in SPELL style of a woman crying while applying lipstick in a broken compact mirror. Speech bubble: 'I have to smile through this, don't I?' Despair is hidden under vibrant colors.",
    "A pop art comic book image in SPELL style of a man shouting in frustration, smashing his fist against a wall. Speech bubble: 'It’s all falling apart!' His anger contrasts with the bold, exaggerated lines.",
    "A pop art comic book image in SPELL style of a woman walking away from a shattered phone, tears running down her face. Speech bubble: 'I should have known you’d never call.' Broken pieces symbolize her emotional breakdown.",
    "A pop art comic book image in SPELL style of a woman standing in the rain, soaked and looking up at the sky. Speech bubble: 'Not again, not you.' Her face reflects anger and deep sorrow.",
    "A pop art comic book image in SPELL style of a couple, their backs turned to each other in a dark room filled with broken glass. Speech bubble from the woman: 'We were never meant to last, were we?' Both characters are lost in their own despair.",
  ]

  return (
    <SidebarLayout>
      <AppSidebar />
      <main className="flex flex-1 flex-col p-2 transition-all duration-300 ease-in-out">
        <div className="h-full rounded-md border-2 border-dashed p-2">
          <SidebarTrigger />
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full md:w-1/2 space-y-4">
                <FormField
                  control={form.control}
                  name="sceneDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scene Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your comic book scene here..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Generate Comic Image
                </Button>
              </form>
            </Form>


            <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
              {image ? (
                <img src={image} alt="Preview" />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Preview image will appear here</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </SidebarLayout>
  );
}
