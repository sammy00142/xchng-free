import SuccessCheckmark from "@/components/successMark";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/utils/firebase";
import { StarIcon } from "@heroicons/react/20/solid";
import { addDoc, collection } from "firebase/firestore";
import React, { BaseSyntheticEvent, useState } from "react";

export const photoUrls = [
  "https://plus.unsplash.com/premium_photo-1696587025055-edee8ff58916?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE2fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1691145445988-563240a2bb82?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIwfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1697215786004-682b1684c65e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDE5fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1699724684258-448f4b9baa38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDMyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1700668497390-43014cf7a3b4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDM3fENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1666968881524-226746362f13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUzfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
  "https://images.unsplash.com/photo-1621246475596-153d9c743fa4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDUyfENEd3V3WEpBYkV3fHxlbnwwfHx8fHw%3D",
];

const PostReview = () => {
  const [reviewState, setReviewState] = useState({
    loading: false,
    sent: false,
  });
  const [review, setReview] = useState({
    username: "",
    review: "",
    stars: 0,
  });

  const stars = [1, 2, 3, 4, 5];

  const submitReview = async (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setReviewState((prev) => {
      return {
        ...prev,
        loading: true,
      };
    });

    try {
      const reviewRef = collection(db, "Feedbacks");
      const reviewData = {
        approved: true,
        user: {
          username: review.username,
          photoUrl: photoUrls[Math.floor(Math.random() * photoUrls.length)],
        },
        content: {
          stars: review.stars,
          review: review.review,
        },
        date: new Date(),
      };
      await addDoc(reviewRef, reviewData);

      setReviewState((prev) => {
        return {
          ...prev,
          loading: false,
          sent: true,
        };
      });
    } catch (error) {
      console.log("Error submitting review", error);
      setReviewState((prev) => {
        return {
          ...prev,
          loading: false,
          sent: false,
        };
      });
    }
  };

  return (
    <div className="bg-white dark:bg-black mb-6 rounded-lg p-8">
      <div className="">
        <p className="text-xs mb-3">Have a review from a customer?</p>
        <Dialog>
          <DialogTrigger className="bg-primary px-6 py-2 w-fit rounded-xl text-white font-semibold">
            Post review
          </DialogTrigger>
          <DialogContent className="z-[99999999] w-[96vw] rounded-xl">
            {reviewState.sent ? (
              <>
                <DialogHeader className="text-center">
                  <h4 className="text-lg font-semibold w-fit mx-auto">Sent</h4>
                </DialogHeader>
                <div>
                  <SuccessCheckmark />
                </div>
                <DialogClose
                  className="bg-primary py-2 w-2/4 px-6 mx-auto rounded-lg text-white"
                  onClick={() => {
                    setReview({
                      username: "",
                      review: "",
                      stars: 0,
                    });
                    setReviewState((prev) => {
                      return {
                        ...prev,
                        loading: false,
                        sent: false,
                      };
                    });
                  }}
                >
                  Okay Close
                </DialogClose>
              </>
            ) : (
              <>
                <DialogHeader>
                  <h4 className="text-lg font-semibold">Add a review</h4>
                </DialogHeader>
                <form
                  onSubmit={(e) => submitReview(e)}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <Label className="text-neutral-600 mb-2" htmlFor="name">
                      Customer&apos;s name
                    </Label>
                    <Input
                      onChange={(e) => {
                        setReview((prev) => {
                          return {
                            ...prev,
                            username: e.target.value,
                          };
                        });
                      }}
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Customer's name"
                    />
                  </div>

                  <div>
                    <Label className="text-neutral-600 mb-2" htmlFor="review">
                      Customer&apos;s review
                    </Label>
                    <textarea
                      onChange={(e) => {
                        setReview((prev) => {
                          return {
                            ...prev,
                            review: e.target.value,
                          };
                        });
                      }}
                      id="review"
                      name="review"
                      rows={5}
                      className="border rounded-lg w-full shadow-sm p-3"
                      placeholder="Customer's review"
                    />
                  </div>

                  <div className="flex align-middle justify-center gap-2">
                    {stars.map((_, idx) => {
                      return (
                        <StarIcon
                          key={idx}
                          width={45}
                          className={`${
                            idx + 1 <= review.stars
                              ? "text-yellow-400 scale-[1.2]"
                              : "text-neutral-400 hover:scale-[1.2]"
                          } cursor-pointer hover:text-yellow-400 transition-all duration-300`}
                          onClick={() => {
                            setReview((prev) => {
                              return {
                                ...prev,
                                stars: idx + 1,
                              };
                            });
                            console.log(review);
                          }}
                        />
                      );
                    })}
                  </div>
                  <Button>Submit</Button>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PostReview;
