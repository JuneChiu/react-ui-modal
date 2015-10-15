import modal from './modal';


window.addEventListener('load', function(){
	document.getElementById('tips').addEventListener('click', () => {

		modal('tips', {
			msg: '获取产品详情失败'
		});

	});

	document.getElementById('dialog').addEventListener('click', () => {
		modal('dialog', {
			title: '提示',
			msg: '这是个对话框',
			className: 'cunstom',
			confirmCallback: () => {
				console.log(123)
			}
		});
	});

	document.getElementById('dialog-wo-cancel').addEventListener('click', () => {
		modal('dialog', {
			title: '提示',
			msg: '这是个对话框',
			cancelTxt: false,
			className: 'cunstom'
		});
	});

})
