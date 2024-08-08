"use client";

import { useEffect, useState } from "react";
import BreedCard from "./components/BreedCard";

type Breed = {
  id: string;
  name: string;
  imageUrl: string;
  type: 'dog' | 'cat';
};

export default function Home() {
  const [breeds, setBreeds] = useState<Breed[]>([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const dogResponse = await fetch(
          'https://api.thedogapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=5',
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_DOG_API_KEY!,
            },
          }
        );
        const catResponse = await fetch(
          'https://api.thecatapi.com/v1/images/search?size=med&mime_types=jpg&format=json&has_breeds=true&order=RANDOM&page=0&limit=5',
          {
            headers: {
              'x-api-key': process.env.NEXT_PUBLIC_CAT_API_KEY!,
            },
          }
        );

        const dogData = await dogResponse.json();
        const catData = await catResponse.json();

        const dogBreeds = dogData.map((dog: any) => ({
          id: dog.breeds[0]?.id || 'unknown',
          name: dog.breeds[0]?.name || 'Unknown',
          imageUrl: dog.url,
          type: 'dog',
        }));

        const catBreeds = catData.map((cat: any) => ({
          id: cat.breeds[0]?.id || 'unknown',
          name: cat.breeds[0]?.name || 'Unknown',
          imageUrl: cat.url,
          type: 'cat',
        }));

        setBreeds([...dogBreeds, ...catBreeds]);
      } catch (error) {
        console.error('Error fetching breeds', error);
      }
    };

    fetchBreeds();
  }, [])

  return (
    <main className="max-w-[1280px] p-[20px] md:mx-auto">
      <h1 className="text-3xl font-bold mb-4">Pet Breed Explorer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:items-center">
        {breeds.map((breed, idx) => (
          <BreedCard
            key={idx}
            id={breed.id}
            name={breed.name}
            imageUrl={breed.imageUrl}
            type={breed.type}
          />
        ))}
      </div>
    </main>
  );
}
