import Link from "next/link";
import Image from "next/image";

type BreedCardProps = {
  name: string;
  imageUrl: string;
  id: string;
  type: 'dog' | 'cat';
};

export default function BreedCard({ name, imageUrl, id, type }: BreedCardProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg my-2">
      <Link href={`/breed/${type}/${id}`}>
        <div className="relative w-full h-80">
          <Image
            src={imageUrl}
            alt={name}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="w-full aspect-square"
          />
        </div>
        <div className="font-bold text-xl py-2 text-center">
          {name}
        </div>
      </Link>
    </div>
  );
};
