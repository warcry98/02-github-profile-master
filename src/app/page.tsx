'use client'

import GithubRepo from "@/components/githubRepo";
import GithubSearch from "@/components/githubSearch";
import { githubAPI, githubRateLimit, githubUserInfo } from "@/lib/api";
import useDebounce from "@/lib/debounce";
import { useOutsideClick } from "@/lib/outsideClick";
import { rateLimit } from "@/lib/rateLimit";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  const [owner, setOwner] = useState("github")
  const [loadingInfoUser, setLoadingInfoUser] = useState(true)
  const [dataInfoUser, setDataInfoUser] = useState<githubUserInfo>()
  const [limitReached, setLimitReached] = useState(false)
  const [repoPerPage, setRepoPerPage] = useState(10)
  const [repoPage, setRepoPage] = useState(1)
  const [searchUserPerPage, setSearchUserPerPage] = useState(10)
  const [searchUserPage, setSearchUserPage] = useState(1)
  const [dataRepo, setDataRepo] = useState({})

  const [searchResult, setSearchResult] = useState("")

  const showSuccessToast = (message: string): void => {
    toast.success(message, {
      position: 'top-right',
      duration: 3000,
    })
  }

  const showErrorToast = (message: string): void => {
    toast.error(message, {
      position: 'top-right',
      duration: 3000,
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: githubRateLimit = await githubAPI.rateLimit()
        if (response.rate.remaining === 0) {
          const timeReset = new Date(response.rate.reset *  1000).toUTCString()
          showErrorToast(`Limit Reached! \n wait until ${timeReset}`)
          setLimitReached(true)
        }
      } catch (err) {
        console.log(err)
        // showErrorToast(err as string)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoadingInfoUser(true)
      try {
        const response: githubUserInfo = await githubAPI.userInfo(owner)
        console.log(response)
        setDataInfoUser(response)
        setLoadingInfoUser(false)
      } catch (err) {
        console.log(err)
        // showErrorToast(err as string)
      }
    }

    fetchData()
  }, [owner])

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth >= 640)
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDataOwnerFromSearch = (data: string) => {
    console.log(data)
    setOwner(data)
  }

  const mobileSrc = "/resources/hero-image-github-profile-sm.jpg"
  const desktopSrc = "/resources/hero-image-github-profile.jpg"
  const currentSrc = isSmallScreen ? desktopSrc : mobileSrc

  return (
    <div className="flex flex-col min-h-screen min-w-screen overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 w-full overflow-hidden h-60 lg:h-60 sm:h-40">
          <Image 
            alt="header" 
            sizes="100vw" 
            fill 
            priority
            src={currentSrc} 
            className="object-cover lg:object-[70%_50%] sm:object-[50%_60%]" 
          />
        </div>
        <div className="bg-slate-800 h-full"></div>
      </div>
      <div className="flex flex-col relative">
        <GithubSearch onChange={handleDataOwnerFromSearch}/>
        <div className="flex flex-col z-10 mt-42 lg:mt-55 relative">
          <div className="flex lg:flex-row flex-col lg:ml-28 ml-12 lg:items-center items-start">
            <div className="w-auto h-auto bg-slate-800 p-2 rounded-lg -translate-y-10 sm:-translate-y-14">
              <div className="w-auto h-auto bg-black rounded-lg">
                {dataInfoUser && <Image alt={dataInfoUser.login} src={dataInfoUser?.avatar_url} height={90} width={90} style={{ width: 'auto', height: 'auto' }} />}
              </div>
            </div>
            <div className="flex flex-row lg:ml-12 lg:w-160 w-120 flex-wrap gap-4">
              <div className="flex flex-row items-stretch bg-gray-900 rounded-xl">
                <div className="h-auto w-auto text-slate-300 p-4 text-base font-be-vietnam-pro font-semibold">
                  Follower
                </div>
                <div className="h-auto my-3 w-px bg-slate-300 rounded-lg"/>
                <div className="h-auto w-auto text-slate-300  p-4 text-base font-be-vietnam-pro font-semibold">
                  {!loadingInfoUser ? dataInfoUser?.followers: 0}
                </div>
              </div>
              <div className="flex flex-row items-stretch bg-gray-900 rounded-xl">
                <div className="h-auto w-auto text-slate-300 p-4 text-base font-be-vietnam-pro font-semibold">
                  Following
                </div>
                <div className="h-auto my-3 w-px bg-slate-300 rounded-lg"/>
                <div className="h-auto w-auto text-slate-300  p-4 text-base font-be-vietnam-pro font-semibold">
                  {!loadingInfoUser ? dataInfoUser?.following : 0}
                </div>
              </div>
              <div className="flex flex-row items-stretch bg-gray-900 rounded-xl">
                <div className="h-auto w-auto text-slate-300 p-4 text-base font-be-vietnam-pro font-semibold">
                  Location
                </div>
                <div className="h-auto my-3 w-px bg-slate-300 rounded-lg"/>
                <div className="h-auto w-auto text-slate-300  p-4 text-base font-be-vietnam-pro font-semibold">
                  {!loadingInfoUser ? dataInfoUser?.location : "N/A"}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:ml-30 ml-12 mt-10">
            <h1 className="text-slate-300 text-4xl font-be-vietnam-pro">{!loadingInfoUser ? dataInfoUser?.name : ""}</h1>
            <h2 className="text-slate-300 text-xl font-be-vietnam-pro">{!loadingInfoUser ? dataInfoUser?.bio : ""}</h2>
          </div>
        </div>
        <GithubRepo owner={owner} />
        <div className="flex items-center justify-center z-30">
          {dataInfoUser && <a href={dataInfoUser.html_url} target="_blank" rel="noopener noreferrer" className="font-be-vietnam-pro text-slate-300 font-semibold text-base mt-12 hover:underline">View all repositories</a>}
        </div>
      </div>

      <Toaster />
    </div>
  );
}
