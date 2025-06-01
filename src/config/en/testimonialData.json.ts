import { type TestimonialItem } from "../types/configDataTypes";

import Jordon from "@images/testimonials/jordon.jpeg";
import Trevor from "@images/testimonials/trevor.jpeg";
import Savpril from "@images/testimonials/savpril.jpeg";
import Nicholas from "@images/testimonials/nick.jpeg";
import Wally from "@images/testimonials/wally.jpeg";

export const testimonialData: TestimonialItem[] = [
  {
    avatar: Trevor,
    name: "Trevor St. Claire | IT Manager",
    title: "",
    testimonial: `I had the pleasure of working with Andrew on a highly complex programming project that required not only technical expertise and our 
    workflows. From day one, Andrew demonstrated an exceptional ability to analyze our requirements, architect a robust solution, and deliver clean, efficient 
    code on time and with zero fluff.
    `,
  },
  {
    avatar: Jordon,
    name: "Jordon Kersey | Senior DevOps Engineer",
    title: "",
    testimonial: `Andrew has a drive like no other. I have not seen a problem that Andrew has turned down. He is always willing to learn more and takes 
    failure as fuel to become better. Not only was he an amazing coworker who always strived to become better, he also became a close friend. Andrew is 
    someone that anyone would be lucky to have on their team.
    `,
  },

  {
    avatar: Savpril,
    name: "Savpril Salwan | Director",
    title: "",
    testimonial: `I worked with Andrew during my stint at Quanterix. He is a great professional and a human being to work with. His competency in technical 
    skills was high and managing work from different operation streams was done very smoothly. The skills that stands him out include empathy, hard work and 
    listening to the problem. I thoroughly enjoyed working with him and he will always be a great addition to any organization.
    `,
  },
  {
    avatar: Nicholas,
    name: "Nicholas Mifflin | IT Manager",
    title: "",
    testimonial: `Andrew has an innate passion for all things Electronic and Information Technology. He is always working on side projects for his own joy without thought of 
    monetization. Working with Andrew was always a pleasure as he pours his very soul into his work. I am certain with time, he will become very proficient at 
    anything he sets his mind to.
    `,
  },
  {
    avatar: Wally,
    name: "Wally Tukis | Director of Software QA",
    title: "",
    testimonial: `Andrew is a great Devops engineer. I enjoyed working with him,`,
  },
];

export default testimonialData;
