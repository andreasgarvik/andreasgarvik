import React from 'react'
import { Link } from 'react-router-dom'
import Truncate from 'react-truncate'

const RecentBlogPost = ({ id, blogpost }) => {
	return blogpost ? (
		<div className='card z-depth-0' style={{ marginTop: '0%' }}>
			<div className='card-content'>
				<img
					className='responsive-img'
					src={blogpost.imageRefs[0]}
					alt={blogpost.imageNames[0]}
				/>
				<span className='card-title'>{blogpost.title}</span>
				<Truncate
					lines={1}
					ellipsis={
						<span>
							...
							<Link
								className='btn grey'
								style={{ marginTop: '2%' }}
								to={`/blogposts/${id}`}
							>
								Read more
							</Link>
						</span>
					}
				>
					{blogpost.content}
				</Truncate>
			</div>
		</div>
	) : null
}

export default RecentBlogPost
