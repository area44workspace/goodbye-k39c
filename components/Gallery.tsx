import fs from 'node:fs/promises';
import { glob } from 'glob';
import { getPlaiceholder } from 'plaiceholder';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

async function getImages(pattern: string) {
  const images = await Promise.all(
    glob.sync(pattern, { posix: true }).map(async (file) => {
      const src = file.replace('public', '');
      const buffer = await fs.readFile(file);
      const {
        metadata: { height, width },
      } = await getPlaiceholder(buffer);
      const { base64 } = await getPlaiceholder(buffer);
      return {
        src,
        width,
        height,
        base64,
      };
    })
  );
  images.sort((a, b) => {
    if (a.src < b.src) {
      return -1;
    }
    if (a.src > b.src) {
      return 1;
    }
    return 0;
  });
  return images;
}

const images = await getImages('public/photos/*.{jpg,png}');

export default function Gallery() {
  return images.map(({ src, height, width, base64 }) => (
    <Dialog>
      <DialogTrigger asChild>
        <AspectRatio
          ratio={3 / 2}
          className='after:content after:shadow-highlight group relative cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg'
        >
          <Image
            src={src}
            placeholder='blur'
            blurDataURL={base64}
            alt='Goodbye K39C HPMU'
            className='rounded-lg object-cover brightness-90 transition will-change-auto group-hover:brightness-110'
            fill
          />
        </AspectRatio>
      </DialogTrigger>
      <DialogContent
        className={`${
          height > width == true ? 'max-w-[400px]' : 'max-w-[600px]'
        } p-0`}
      >
        <Image
          src={src}
          placeholder='blur'
          blurDataURL={base64}
          height={height}
          width={width}
          alt='Goodbye K39C HPMU'
          className='object-contain sm:rounded-lg'
        />
      </DialogContent>
    </Dialog>
  ));
}
