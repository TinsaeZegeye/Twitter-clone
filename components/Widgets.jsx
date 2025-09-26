'use client'

import { SearchIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import News from './News'
import { motion, AnimatePresence } from 'motion/react'

export default function Widgets({ articles, results }) {
    const [articleNum, setArticleNum] = useState(3)
    const [randomUserNum, setRandomUserNum] = useState(3)

    return (
        <div className='xl:w-[600px] hidden lg:inline ml-8 space-y-5'>
            <div className='w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50'>
                <div className='flex items-center p-3 rounded-full relative'>
                    <SearchIcon className='h-5 text-gray-500 z-50' />
                    <input
                        type="text"
                        placeholder='Search Twitter'
                        className='absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100 p-2'
                    />
                </div>
            </div>

            <div className='text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%]'>
                <h4 className='font-bold text-xl px-4'>What's Happening?</h4>
                <AnimatePresence>
                    {articles?.slice(0, articleNum).map((article, index) => (
                        <motion.div
                            key={`${article.title}-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <News article={article} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    onClick={() => setArticleNum(articleNum + 3)}
                    className={`${articleNum > articles.length - 3 && 'hidden'} text-blue-300 pl-4 pb-3 hover:text-blue-400 cursor-pointer`}
                >
                    Show more
                </button>

                <button
                    onClick={() => setArticleNum(articleNum - 3)}
                    className={`${articleNum <= 3 && 'hidden'} text-blue-300 pl-4 pb-3 hover:text-blue-400 cursor-pointer`}
                >
                    Hide
                </button>
            </div>

            <div className='text-gray-700 space-y-3 bg-gray-100 pt-2 rounded-xl w-[90%] xl:w-[75%] sticky top-16'>
                <h4 className='font-bold text-xl px-4'>Who to Follow?</h4>
                <AnimatePresence>
                    {results.slice(0, randomUserNum).map((result, index) => (
                        <motion.div
                            key={`${result.login.username}-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <div className='flex items-center px-4 py-2 cursor-pointer hoverEffect'>
                                <img
                                    className='rounded-full'
                                    src={result.picture.thumbnail}
                                    alt="User-Profile-Image"
                                    width='40'
                                />

                                <div className='truncate leading-5 ml-4'>
                                    <h4 className='font-bold hover:underline text-[14px] truncate'>
                                        {result.login.username}
                                    </h4>
                                    <h5 className='text-[13px] text-gray-500 truncate'>
                                        {result.name.first + ' ' + result.name.last}
                                    </h5>
                                </div>

                                <button className='ml-auto bg-black text-white rounded-full text-sm px-3.5 py-1.5 font-bold cursor-pointer hover:brightness-90'>
                                    Follow
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    onClick={() => setRandomUserNum(randomUserNum + 3)}
                    className={`${randomUserNum > results.length - 3 && 'hidden'} text-blue-300 pl-4 pb-3 hover:text-blue-400 cursor-pointer`}
                >
                    Show more
                </button>

                <button
                    onClick={() => setRandomUserNum(randomUserNum - 3)}
                    className={`${randomUserNum <= 3 && 'hidden'} text-blue-300 pl-4 pb-3 hover:text-blue-400 cursor-pointer`}
                >
                    Hide
                </button>
            </div>
        </div>
    )
}
