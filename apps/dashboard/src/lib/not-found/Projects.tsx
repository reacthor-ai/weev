import Image from 'next/image'
import notFoundProjects from '../../../public/44.png'

export const ProjectsNotFound = () => {
  return (
    <div className='flex items-center justify-center flex-col'>
      <div>
        <Image
          src={notFoundProjects}
          width={300}
          height={300}
          style={{
            aspectRatio: '100/100',
            objectFit: 'cover'
          }}
          alt='Not found image'
        />
      </div>
      <div className='text-center'>
        <h2 className='text-2xl font-bold mb-4'>No projects yet!</h2>
        <p>Create your new projects</p>
      </div>
    </div>
  )
}
