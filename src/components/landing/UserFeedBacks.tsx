"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { StarIcon } from "@heroicons/react/24/solid";
import styles from "@/css/feedback.module.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/utils/firebase";
import { Feedback } from "../../../types";
interface StarsProps {
  userStars: number;
  totalStars?: number;
}

const feedbacksdat = [
  {
    approved: true,
    date: {
      nanoseconds: 239094834,
      seconds: 2938345945,
    },
    user: {
      username: "Adeseware",
      photoUrl:
        "https://images.unsplash.com/photo-1634896941598-b6b500a502a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8M2QlMjBhdmF0YXJzfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60",
    },
    content: {
      stars: 5,
      review:
        "Great Exchange is a fantastic platform for gift card exchange! It simplifies everything, from managing my cards to seamless transactions. I'm thrilled with the convenience it offers.",
    },
  },
  {
    approved: true,
    date: {
      nanoseconds: 239094834,
      seconds: 2938345945,
    },
    user: {
      username: "Bernard",
      photoUrl:
        "https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=600&q=60",
    },
    content: {
      stars: 4,
      review:
        "Great Exchange is an excellent choice for gift card swapping. It has all my essential information neatly organized. The ease of use is impressive.",
    },
  },
  {
    approved: true,
    date: {
      nanoseconds: 239094834,
      seconds: 2938345945,
    },
    user: {
      username: "Chisom",
      photoUrl:
        "https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?ixlib=rb-4.0.3&xid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60",
    },
    content: {
      stars: 5,
      review:
        "Great Exchange has been a game-changer for me in the gift card exchange world. It's a one-stop solution that takes care of everything. Highly recommended!",
    },
  },
  {
    approved: true,
    date: {
      nanoseconds: 239094834,
      seconds: 2938345945,
    },
    user: {
      username: "Darek",
      photoUrl:
        "https://images.unsplash.com/photo-1634195130430-2be61200b66a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDEyfHx8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60",
    },
    content: {
      stars: 4,
      review:
        "Great Exchange is a reliable platform for managing and trading gift cards. It keeps my important details secure and simplifies the process. Kudos to the team!",
    },
  },
];

const UserFeedBacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(feedbacksdat);
  const [cApi, setCApi] = useState<CarouselApi>();
  const [currSlide, setCurrSlide] = useState(0);
  const [count, setCount] = useState(0);

  const fetchfeedbacks = async () => {
    try {
      const ref = collection(db, "Feedbacks");

      const { docs } = await getDocs(ref);

      const data = docs.map((doc) => {
        return { ...(doc.data() as Feedback), id: doc.id };
      });

      setFeedbacks(data);
    } catch (error) {
      console.log("Error fetching feedbacks", error);
    }
  };

  useEffect(() => {
    fetchfeedbacks();
  }, []);

  useEffect(() => {
    if (!cApi) {
      return;
    }

    setCount(cApi.scrollSnapList().length);
    setCurrSlide(cApi.selectedScrollSnap() + 1);

    cApi.on("select", () => {
      setCurrSlide(cApi.selectedScrollSnap() + 1);
    });
  }, [cApi]);

  return (
    <div className="py-24">
      <div className="max-w-screen-lg mx-auto">
        <h4 className="font-black text-2xl mb-8">Feedbacks</h4>
        <div className="md:py-16">
          <Carousel>
            <CarouselContent className="-ml-1">
              {feedbacks.map((feedback, idx) => {
                const userStars = feedback.content.stars;
                const greyStars = 5 - userStars;

                return (
                  <CarouselItem
                    key={idx}
                    className="pl-2 md:basis-1/2 lg:basis-1/3 relative"
                  >
                    <Card className="bg-purple-400">
                      <CardContent className="flex aspect-square items-center justify-center">
                        <div className="absolute top-10 flex align-middle place-items-center">
                          {Array.from({ length: userStars }).map(
                            (star, idx) => {
                              return (
                                <StarIcon color="gold" key={idx} width={38} />
                              );
                            }
                          )}
                          {Array.from({ length: greyStars }).map(
                            (star, idx) => {
                              return (
                                <StarIcon
                                  color="#d9d9d9"
                                  key={idx}
                                  width={38}
                                />
                              );
                            }
                          )}
                        </div>
                        <div className="para leading-6 text-purple-100">
                          {feedback.content.review}
                        </div>
                        <div className="absolute bottom-16 grid align-middle place-items-center gap-4">
                          <div className="flex align-middle justify-between gap-3 place-items-center">
                            <Image
                              width={40}
                              height={40}
                              src={
                                "https://images.unsplash.com/photo-1637216099315-a413cf383e9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEwMHxDRHd1d1hKQWJFd3x8ZW58MHx8fHx8"
                              }
                              alt={`${feedback.user.username}'s Picture`}
                              className="aspect-square object-cover object-top rounded-full"
                            />
                            <h4 className="font-semibold text-lg">
                              {feedback.user.username}
                            </h4>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default UserFeedBacks;
