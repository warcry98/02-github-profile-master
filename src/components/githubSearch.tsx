'use client'

import { githubAPI, githubUserSearch, githubUserSearchItem } from "@/lib/api"
import useDebounce from "@/lib/debounce"
import { useOutsideClick } from "@/lib/outsideClick"
import Image from "next/image"
import React, { ChangeEvent, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"

interface ChildProps {
  onChange: (value: string) => void
}

const GithubSearch: React.FC<ChildProps> = ({ onChange }) => {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [usernameSearch, setUsernameSearch] = useState("")
  const [owner, setOwner] = useState("github")
  const debouncedUsernameSearch = useDebounce<string>(usernameSearch, 500)

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const [limit, setLimit] = useState(1)
  const [page, setPage] = useState(1)

  const [resultSearch, setResultSearch] = useState<githubUserSearchItem[]>([])

  const listRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  const showErrorToast = (message: string): void => {
    toast.error(message, {
      position: 'top-right',
      duration: 3000,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: githubUserSearch = await githubAPI.searchUser(debouncedUsernameSearch, limit, null)
        setResultSearch(response.data.search.edges)
      } catch (err) {
        console.log(err)
        // showErrorToast(err as string)
      }
    }

    if (debouncedUsernameSearch) {
      fetchData()
    }
  }, [debouncedUsernameSearch, limit])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsernameSearch(e.target.value)
  }

  const handleClickOutside = () => {
    setIsSearchActive(false)
  }

  const searchContainerRef = useOutsideClick(handleClickOutside)

  const handleFocus = () => {
    setIsSearchActive(true)
  }

  return (
    <div className={`flex flex-col items-center ${isSearchActive ? 'translate-x-4' : ''} translate-x-12 absolute inset-0 z-20`}>
      <div ref={searchContainerRef}>
        <div className="flex flex-row justify-center items-center mt-7 -translate-x-15">
        <Image alt="search-icon" src="/resources/Search.svg" width={20} height={20} className="translate-x-10" style={{ width: 'auto', height: '28px' }} />
        <div className="inset-0 h-12 lg:w-120 w-120 rounded-xl bg-slate-800">
          <input type="search" title="search" placeholder="username" onFocus={handleFocus} onChange={handleInputChange} className={`text-slate-300 text-s h-full w-full pl-12 font-be-vietnam-pro`}/>
        </div>
      </div>

      {isSearchActive && resultSearch.length > 0 && <div className="mt-2 rounded-xl flex flex-col justify-start items-start -translate-x-8 w-120 bg-gray-900 z-20">
      {resultSearch.length > 0 && resultSearch.map((result, i) => (
        <button type="button" onClick={() => {setOwner(result.node.login); setIsSearchActive(false); onChange(result.node.login)}} className="flex flex-row justify-start items-start" key={i}>
          <Image alt={result.node.login} src={result.node.avatarUrl} height={50} width={50} style={{ width: 'auto', height: 'auto'}} className="p-3"/>
          <div className="flex flex-col p-4 text-slate-300 font-be-vietnam-pro">
            <h3 className="text-xl font-semibold">{result.node.name}</h3>
            <h3 className="text-xs pt-1">{result.node.description ? result.node.description : result.node.bio}</h3>
          </div>
        </button>
      ))}
      </div>}
      </div>
    </div>
  )
}

export default GithubSearch