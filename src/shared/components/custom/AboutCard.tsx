import { FC } from "react";

interface AboutCardProps {
  name: string;
}

const AboutCard: FC<AboutCardProps> = ({ name }) => {
  return (
    <div className="bg-white shadow  p-3">
      <p className=" font-semibold ">About</p>
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300">
          <span className="text-gray-500 text-xl">👤</span>
        </div>
        <p className="mt-3 text-sm text-primary">{name}</p>
      </div>
    </div>
  );
};

export default AboutCard;
