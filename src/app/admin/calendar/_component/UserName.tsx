"use client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  key?: string;
  name: string;
  link: string;
};

const UserName: React.FC<Props> = ({ key, name, link }) => {
  return (
    <Link
      href={link}
      key={key}
      className="flex cursor-pointer items-center border-secondary hover:rounded-lg hover:border-[2px]"
    >
      <div className="flex">
        <Image
          src="/profile-red.png"
          width={20}
          height={20}
          alt="プロフィール"
          className="mx-2"
        />
        <span className="font-body mr-2 text-base font-[12px]">{name}</span>
      </div>
    </Link>
  );
};

export default UserName;
