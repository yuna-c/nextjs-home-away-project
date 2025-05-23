import Image from 'next/image'

function ImageContainer({ mainImage, name }: { mainImage: string; name: string }) {
  return (
    <section className='relative mt-8 h-[300px] md:h-[500px]'>
      <Image
        src={mainImage}
        fill
        sizes='100vw'
        alt={name}
        className='rounded object-cover'
        priority
      />
    </section>
  )
}

export default ImageContainer
