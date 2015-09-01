import React from 'react';
import classNames from 'classnames';
import style from '../style/modal.styl';

let inlineStyle = {}

class Modal extends React.Component{

	constructor(props) {

		super(props);

		// 设置状态强制执行渲染
		this.state = {
			ready: false,
			destroy: false
		}

		this.close = this.close.bind(this);
	}

	close(){

		this.setState({
			destroy: true
		});

		document.body.classList.remove(style.frozen);
	}

	componentDidMount(){
		let containerEl = React.findDOMNode(this.refs.container);

		let bounds = containerEl.getBoundingClientRect();

		inlineStyle.marginLeft = - bounds.width / 2

		inlineStyle.marginTop = - bounds.height / 2

		this.setState({
			ready: true
		});

		document.body.classList.add(style.frozen);

		if(this.props.autoClose){
			setTimeout(() => {
				this.close();

			}, this.props.autoClose)
		}

		containerEl.addEventListener("transitionend", (e) =>{

			let wrapEl = React.findDOMNode(this.refs.wrap);

			// 移除组件
			if(this.state.destroy && wrapEl){
				
				let scopeEl = wrapEl.parentNode;
				React.unmountComponentAtNode(scopeEl);

				// 移除真实DOM
				scopeEl.parentNode.removeChild(scopeEl);
			}
		});

		containerEl.addEventListener("click", (e) =>{
			let action = e.target.dataset.action
			
			switch (action) {
				case 'close':
					this.close();

					this.props.cancelCallback && this.props.cancelCallback();

				case 'confirm':
					
					if(this.props.confirmCallback){
						this.props.confirmCallback(this);
					}
					else{
						this.close();
					}
			}
		});
	}
	
	componentWillUnmount(){

		this.close();
	}

	render() {

		return (
			<div ref="wrap">
				<div className={classNames(style.mask, {active: this.state.ready && !this.state.destroy})}></div>
				<div style={inlineStyle} className={classNames(style.container, this.props.className, {active: this.state.ready && !this.state.destroy})} ref="container">
					{this.props.children}
				</div>
			</div>
		)
	}
}

class Tips extends React.Component{
	constructor(props) {
		super(props);
	}
	render(){
		let props = this.props;

		return <Modal className={classNames(style.tips, this.props.className)} autoClose={props.duration || 2000} {...props}>
					{props.msg}
				</Modal>
	}
}

class Dialog extends React.Component{
	constructor(props) {
		super(props);
	}

	render(){
		let props = this.props;

		let titleEl = false, msgEl = false;

		if(props.title){
			titleEl = <header>{props.title}</header>
		}

		if(props.msg){
			msgEl = <section>{props.msg}</section>
		}

		return <Modal className={classNames(style.dialog, this.props.className)} {...props}>
					{titleEl}
					{msgEl}
					<footer>
						<button data-action="close">{props.cancelTxt || '取消'}</button>
						<button data-action="confirm">{props.confirmTxt || '确定'}</button>
					</footer>
				</Modal>
	}
}



export default function(type, option){

	type = type.toLowerCase();

	let el = document.createElement('div')

	document.body.appendChild(el);

	switch (type) {
		case 'tips':
			React.render(React.createElement(Tips, option), el);
			break

		case 'dialog':
			React.render(React.createElement(Dialog, option), el);
			break
	}
	
}