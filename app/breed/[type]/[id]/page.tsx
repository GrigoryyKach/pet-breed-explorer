"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

type BreedInfo = {
  name: string;
  desc?: string;
  images: string[];
  weight: string;
  height: string;
  bredFor: string;
  breedGroup: string;
  lifeSpan: string;
  temperament: string;
  wiki: string;
};

export default function BreedPage() {
  const [breedInfo, setBreedInfo] = useState<BreedInfo | null>(null);
  const params = useParams();
  const { id, type } = params;

  useEffect(() => {
    if (!id || !type) return;

    const fetchBreedInfo = async () => {
      try {
        const breedApiUrl = type === 'dog'
          ? `https://api.thedogapi.com/v1/breeds/${id}`
          : `https://api.thecatapi.com/v1/breeds/${id}`;

        const imagesApiUrl = type === 'dog'
          ? `https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&breed_ids=${id}`
          : `https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&breed_ids=${id}`;

        const breedResponse = await fetch(breedApiUrl, {
          headers: {
            'x-api-key': type === 'dog'
              ? process.env.NEXT_PUBLIC_DOG_API_KEY!
              : process.env.NEXT_PUBLIC_CAT_API_KEY!,
          },
        });
        const breedData = await breedResponse.json();

        const imagesResponse = await fetch(imagesApiUrl, {
          headers: {
            'x-api-key': type === 'dog'
              ? process.env.NEXT_PUBLIC_DOG_API_KEY!
              : process.env.NEXT_PUBLIC_CAT_API_KEY!,
          },
        });
        const imagesData = await imagesResponse.json();

        const breedInfoData: BreedInfo = {
          name: breedData.name || "Unknown",
          desc: breedData.description || "No description available",
          images: imagesData.map((image: any) => image.url),
          weight: breedData.weight ? breedData.weight.metric : "N/A",
          height: breedData.height ? breedData.height.metric : "N/A",
          bredFor: breedData.bred_for || "N/A",
          breedGroup: breedData.breed_group || "N/A",
          lifeSpan: breedData.life_span || "N/A",
          temperament: breedData.temperament || "N/A",
          wiki: breedData.wikipedia_url || null,
        };

        setBreedInfo(breedInfoData);
      } catch (error) {
        console.error('Error fetching breed info:', error)
      }
    };

    fetchBreedInfo();
  }, []);

  if (!breedInfo) return <div>Loading...</div>;

  return (
    <div className="max-w-[1280px] p-[20px] md:mx-auto">
      <h1 className="text-3xl font-bold mb-4">{breedInfo.name}</h1>
      <p className="mb-4 max-w-[550px]">{breedInfo.desc}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {breedInfo.images.map((imageUrl, idx) => (
          <div
            key={idx}
            className="relative w-full h-96 mb-4"
          >
            <Image
              src={imageUrl}
              alt={breedInfo.name}
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-md"
            />
          </div>
        ))}
      </div>
      <ul className="">
        <li>
          <strong>Weight:</strong> {breedInfo.weight} kg
        </li>
        <li>
          <strong>Height:</strong> {breedInfo.height} cm
        </li>
        <li>
          <strong>Bred for:</strong> {breedInfo.bredFor}
        </li>
        <li>
          <strong>Breed Group:</strong> {breedInfo.breedGroup}
        </li>
        <li>
          <strong>Life Span:</strong> {breedInfo.lifeSpan}
        </li>
        <li>
          <strong>Temperament:</strong> {breedInfo.temperament}
        </li>
        {breedInfo.wiki ? (
          <li>
            <a
              href={breedInfo.wiki}
              className="text-violet-500"
            >
              Wiki
            </a>
          </li>
        ) : (
          null
        )
        }
      </ul>
    </div>
  )
}
