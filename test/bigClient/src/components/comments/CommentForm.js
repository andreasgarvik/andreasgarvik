import React from 'react'
import { connect } from 'react-redux'
import { postComment } from '../../store/actions'

class CommentForm extends React.Component {
	state = { name: '', text: '' }

	handleChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		})
	}

	handleSubmit = e => {
		e.preventDefault()
		this.props.showCommentForm()
		this.props.postComment(this.state, this.props.id)
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit} className='white'>
				<h6 className='grey-text text-darken-3' style={{ marginBottom: '5%' }}>
					Comment
				</h6>
				<div className='input-field'>
					<label htmlFor='name'>Name</label>
					<input
						type='text'
						id='name'
						maxLength='100'
						onChange={this.handleChange}
					/>
				</div>
				<div className='input-field'>
					<label htmlFor='text'>Comment</label>
					<textarea
						id='text'
						maxLength='1000'
						className='materialize-textarea'
						onChange={this.handleChange}
					/>
				</div>
				<button
					style={{ marginBottom: '4%' }}
					className={`btn grey z-depth-0 right ${
						!this.state.name || !this.state.text ? 'disabled' : ''
					}`}
				>
					Post
				</button>
			</form>
		)
	}
}

export default connect(
	null,
	{ postComment }
)(CommentForm)
