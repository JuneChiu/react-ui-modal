import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import prefixr from 'react-prefixr';
import style from '../style/modal.styl';

export class Modal extends Component{

	constructor(props) {

		super(props);

		this.state = {
			ready: false,
			destroy: false
		};

		this.style = {};

		this.close = this.close.bind(this);
	}

	close(){

		this.setState({
			destroy: true
		});

		document.body.classList.remove(style.frozen);
	}

	componentDidMount(){
		const containerEl = ReactDOM.findDOMNode(this.refs.container),
			maskEl = ReactDOM.findDOMNode(this.refs.mask);

		const bounds = containerEl.getBoundingClientRect();

		// 避免进行3d变换时候产生字体模糊问题 
		const [left, top] = [parseInt((window.innerWidth - bounds.width) / 2), parseInt((window.innerHeight - bounds.height) / 2)];

		this.style = prefixr({transform: `translate3d(${left}px, ${top}px, 0)`});

		this.setState({
			ready: true
		});

		document.body.classList.add(style.frozen);

		if(this.props.autoClose){
			setTimeout(() => {
				this.close();
			}, this.props.autoClose)
		}
		
		['touchstart', 'touchmove', 'touchsend'].forEach((event) => {
			maskEl.addEventListener(event, (e) =>{
				e.preventDefault();
				e.stopPropagation();
			});
		});


		['webkitTransitionEnd', 'transitionend', 'oTransitionEnd'].forEach((event) => {

			containerEl.addEventListener(event, (e) =>{

				const wrapEl = ReactDOM.findDOMNode(this.refs.wrap);

				// 移除组件
				if(this.state.destroy && wrapEl){
					
					const scopeEl = wrapEl.parentNode;

					ReactDOM.unmountComponentAtNode(scopeEl);

					// 移除真实DOM
					scopeEl.parentNode.removeChild(scopeEl);
				}
			});
		});

		containerEl.addEventListener("click", (e) =>{
			const action = e.target.dataset.action, props = this.props;

			switch (action) {
				case 'close':
					this.close();

					props.cancelCallback && props.cancelCallback();

					break

				case 'confirm':
					
					if(props.confirmCallback){
						props.confirmCallback(this);
					}
					else{
						this.close();
					}

					break
			}
		});
	}
	
	componentWillUnmount(){
		this.close();
	}

	render() {

		const state = this.state;

		return (
			<div className={style.wrap} ref="wrap">

				<div className={classNames(style.mask, {active: state.ready && !state.destroy})} ref="mask"></div>

				<div style={this.style} className={classNames(style.container, this.props.className, {active: state.ready && !state.destroy})} ref="container">

					{this.props.children}
				</div>
			</div>
		)
	}
}

class Tips extends Component{
	constructor(props) {
		super(props);
	}
	render(){
		const props = this.props;

		let arg = Object.assign({}, props);

		delete arg.className;

		return <Modal className={classNames(style.tips, props.className)} autoClose={props.duration || 2000} {...arg}>
					{props.msg}
				</Modal>
	}
}

class Dialog extends Component{

	constructor(props) {
		super(props);
	}

	render(){
		const props = this.props;

		let arg = Object.assign({}, props);

		delete arg.className;

		return <Modal className={classNames(style.dialog, props.className)} {...arg}>

					{props.title && <header>{props.title}</header>}

					{props.msg && <section>{props.msg}</section>}

					<footer>
						{props.cancelTxt && <button data-action="close">{props.cancelTxt}</button>}
						
						{props.confirmTxt && <button data-action="confirm">{props.confirmTxt}</button>}
					</footer>
				</Modal>
	}
}

Dialog.defaultProps = {
	cancelTxt: '取消',
	confirmTxt: '确定'
}

export default function(type, option){

	type = type.toLowerCase();

	const el = document.createElement('div')

	document.body.appendChild(el);

	switch (type) {
		case 'tips':
			ReactDOM.render(React.createElement(Tips, option), el);
			break

		case 'dialog':
			ReactDOM.render(React.createElement(Dialog, option), el);
			break
	}
}