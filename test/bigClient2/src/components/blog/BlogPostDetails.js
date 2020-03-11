import React from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { editHeartBlogPost, deleteBlogPost } from '../../store/actions'
import Moment from 'react-moment'
import ProgressiveImage from '../../utils/ProgressiveImage'
import M from 'materialize-css'
import Navbar from '../ui/Navbar'
import FloatingActionButton from '../links/FloatingActionButton'
import CommentArea from '../comments/CommentArea'
import CommentForm from '../comments/CommentForm'

class BlogPostDetails extends React.Component {
	state = { heart: false, commentFormShowing: false }

	componentDidMount = () => {
		M.AutoInit()
	}

	handleDelete = () => {
		const { deleteBlogPost, blogpost, id } = this.props
		deleteBlogPost(blogpost, id)
		this.props.history.push('/')
	}

	showCommentForm = () => {
		this.state.showCommentForm
			? this.setState({ showCommentForm: false })
			: this.setState({ showCommentForm: true })
	}

	showHeart = () => {
		return this.state.heart ? (
			<button
				onClick={this.handleHeart}
				className='btn-floating btn-large red lighten-3 right'
				style={{ marginTop: '3%' }}
			>
				<i className='material-icons'>favorite</i>
			</button>
		) : (
			<button
				onClick={this.handleHeart}
				className='btn-floating btn-large red lighten-3 right'
				style={{ marginTop: '3%' }}
			>
				<i className='material-icons'>favorite_border</i>
			</button>
		)
	}

	handleHeart = () => {
		if (!this.state.heart) {
			this.setState({ heart: true })
			this.props.editHeartBlogPost(this.props.id, 1)
		}
	}

	renderContentAndImages = ({ content, imageRefs }) => {
		const maxLength = 2500
		if (content.length > maxLength) {
			let first = content.substring(0, maxLength)
			first = first.substring(
				0,
				Math.min(first.length, first.lastIndexOf('\n'))
			)

			let second = content.substring(first.length, maxLength * 2)
			second = second.substring(
				0,
				Math.min(second.length, second.lastIndexOf('\n'))
			)

			let third = content.substring(first.length + second.length, maxLength * 3)
			third = third.substring(
				0,
				Math.min(third.length, third.lastIndexOf('\n'))
			)

			let fourth = content.substring(
				first.length + second.length + third.length,
				maxLength * 4 + 1
			)
			fourth = fourth.substring(
				0,
				Math.min(fourth.length, fourth.lastIndexOf('\n'))
			)

			return (
				<>
					{this.renderContent(first)}
					{this.renderImage(imageRefs[1])}
					{this.renderContent(second)}
					{this.renderImage(imageRefs[2])}
					{this.renderContent(third)}
					{this.renderImage(imageRefs[3])}
					{this.renderContent(fourth)}
				</>
			)
		}
		return (
			<>
				{this.renderContent(content)}
				{this.renderImage(imageRefs[1])}
			</>
		)
	}

	renderContent = content => {
		return <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
	}

	renderImage = image => {
		return (
			<img
				key={image}
				style={{ marginTop: '4%' }}
				className='responsive-img'
				src={image}
				alt=''
			/>
		)
	}

	moreImages = ({ imageRefs }) => {
		const rest = imageRefs.slice(4)
		return rest.map(image => {
			return this.renderImage(image)
		})
	}

	render() {
		const { blogpost, id, comments, hearts } = this.props
		return (
			<>
				<Navbar location={this.props.history.location} />
				<div className='container'>
					{blogpost ? (
						<div className='card z-depth-0'>
							<div className='card-content'>
								<ProgressiveImage image={blogpost.imageRefs[0]} />
								<span className='card-title' style={{ marginTop: '2%' }}>
									{blogpost.title}
								</span>
								{this.renderContentAndImages(blogpost)}
								{this.moreImages(blogpost)}
								{this.showHeart()}
								<button
									onClick={this.showCommentForm}
									className='btn-floating btn-large grey'
									style={{ marginTop: '3%' }}
								>
									<i className='material-icons'>format_align_left</i>
								</button>
								{this.props.auth.uid ? (
									<h4
										className='right'
										style={{ marginRight: '4%', marginTop: '4.5%' }}
									>
										{hearts}
									</h4>
								) : null}
							</div>
							<div
								className='card-action grey lighten-4 grey-text'
								style={{ border: 'none' }}
							>
								<div>Posted by {blogpost.auther}</div>
								<div>
									<Moment format='D MMM YYYY'>{blogpost.timestamp}</Moment>
								</div>
							</div>
						</div>
					) : null}
					{comments ? <CommentArea comments={this.props.comments} /> : null}
					{this.state.showCommentForm ? (
						<CommentForm id={id} showCommentForm={this.showCommentForm} />
					) : null}
				</div>
				{this.props.auth.uid ? <FloatingActionButton id={id} /> : null}
				<div id='deleteModal' className='modal bottom-sheet'>
					<div className='modal-content'>
						<h4>Are you sure you want to delete this blogpost?</h4>
					</div>
					<div className='modal-footer' style={{ marginBottom: '2%' }}>
						<button
							className='modal-close btn-large red modal-trigger'
							onClick={this.handleDelete}
						>
							<i className='large material-icons'>delete</i>
						</button>
					</div>
				</div>
			</>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = ownProps.match.params.id
	const blogposts = state.firestore.ordered.blogposts
	const blogpost = blogposts ? blogposts[0] : null
	const comments = state.firestore.ordered.comments
	const hearts = state.firestore.ordered.hearts
		? state.firestore.ordered.hearts.length
		: 0
	const auth = state.firebase.auth
	return { blogpost, id, auth, comments, hearts }
}

export default compose(
	connect(
		mapStateToProps,
		{ editHeartBlogPost, deleteBlogPost }
	),
	firestoreConnect(props => [
		`blogposts/${props.match.params.id}`,
		{
			collection: 'comments',
			orderBy: 'timestamp',
			where: ['blogpost', '==', `${props.match.params.id}`]
		},
		{
			collection: 'hearts',
			where: ['blogpost', '==', `${props.match.params.id}`]
		}
	])
)(BlogPostDetails)
