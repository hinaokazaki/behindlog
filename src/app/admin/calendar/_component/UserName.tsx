"use client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  name: string;
  link: string;
};

const UserName: React.FC<Props> = ({ name, link }) => {
  return (
    <Link href={link}>
      <div className="flex">
        <Image
          src="/profile-red.png"
          width={30}
          height={30}
          alt="プロフィール"
          className="mx-2"
        />
        <span className="mr-2 text-base font-bold">{name}</span>
      </div>
    </Link>
  );
};

export default UserName;
