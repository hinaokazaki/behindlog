"use client";
import { User } from "lucide-react";
import Link from "next/link";

type Props = {
  key?: string;
  name: string;
  link: string;
};

const UserName: React.FC<Props> = ({ key, name, link }) => {
  return (
    <Link
      key={key}
      href={link}
      className="flex cursor-pointer items-center border-secondary hover:rounded-lg hover:border-[2px]"
    >
      <div className="flex flex-row">
        <User className="h-5 w-5 text-buttonMain" />
        <span className="font-body mr-2 text-base font-[12px]">{name}</span>
      </div>
    </Link>
  );
};

export default UserName;
