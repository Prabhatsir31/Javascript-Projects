let toastBox = document.getElementById('toastBox');
let successMsg = '<i class="fas fa-check-circle"></i> Successfully Submitted';
let errorMsg = '<i class="fas fa-circle-xmark"></i> Please fix the error!';
let invalidMsg = '<i class="fas fa-circle-exclamation"></i> Invalid input, check again';

function showToast(msg) {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerHTML = msg;
    toastBox.appendChild(toast);

    if(msg.includes('error')) {
        toast.classList.add('error');
    }
    if(msg.includes('Invalid')) {
        toast.classList.add('invalid'); // Update to 'invalid'
    }

    setTimeout(() => {
        toast.remove();
    }, 6000);
}
