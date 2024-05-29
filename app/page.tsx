import Image from 'next/image'
import Navbar from './components/navbar'
import { getCurrentUser } from './lib/session'

export default async function Home() {
  const user = await getCurrentUser()
  return (
    <div className='px-5 max-w-[1280px] mx-auto'>
      <Navbar/>
      <hr />
      {/* <Container/> */}
    </div>
  )
}