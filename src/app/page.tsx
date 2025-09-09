import dynamic from 'next/dynamic'

const SearchExperience = dynamic(
  () => import('@/components/Search/SearchExperience'),
  {
    ssr: false,
    loading: () => <p>Loading search magic... 🔮</p>
  }
)

export default function Home() {
  return <SearchExperience />
}