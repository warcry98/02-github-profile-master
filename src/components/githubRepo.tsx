'use client'

import { githubAPI, githubRepo } from "@/lib/api"
import { timeAgo } from "@/lib/timeAgo"
import Image from "next/image"
import React, { useEffect, useState } from "react"

interface repoProps {
  owner: string
}

const GithubRepo: React.FC<repoProps> = ({ owner }) => {
  const [repoList, setRepoList] = useState<githubRepo[]>([])
  // const [owner, setOwner] = useState("github")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: githubRepo[] = await githubAPI.userRepos(owner, 4, 1)
        setRepoList(response)
      } catch (err) {
        console.log(err)
      }
    }

    fetchData()
  }, [owner])

  return (
    <div className="flex justify-center mt-10 lg:ml-2 ml-3">
      <div className="grid lg:gap-8 gap-6 lg:grid-cols-2 sm:grid-cols-1">
        {repoList.map((repo) => (
          <div className="flex flex-col bg-linear-to-r from-slate-900 to-indigo-950  rounded-xl xl:w-128 lg:w-95 sm:w-140 p-4 font-be-vietnam-pro" key={repo.id}>
            <h4 className="font-semibold text-lg mb-3 text-slate-300">{repo.name}</h4>
            <p className="flex-1 text-sm mb-3 text-slate-400">{repo.description}</p>
            <div className="flex flex-row gap-1 items-center text-slate-400 text-sm">
              {repo.license && (
                <div className="flex flex-row p-1">
                  <Image alt={`${repo.name}-license`} src="/resources/Chield_alt.svg" width={24} height={24} className="mr-1"/>
                  {repo.license.spdx_id}
                </div>
              )}
              <div className="flex flex-row p-1 items-center">
                <Image alt={`${repo.name}-fork`} src="/resources/Nesting.svg" width={24} height={24} />
                {repo.forks_count}
              </div>
              <div className="flex flex-row p-1 items-center">
                <Image alt={`${repo.name}-star`} src="/resources/Star.svg" width={24} height={24} className="mr-1"/>
                {repo.stargazers_count}
              </div>
              <div className="text-[10px] ml-4">
                {timeAgo(repo.updated_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GithubRepo