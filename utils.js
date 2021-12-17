exports.isArrayElementsEqual =
function isArrayElementsEqual(arr1, arr2){
    let a = [];
    if(arr1.length != arr2.length) return false;
    for(let e of arr1){
        if(arr2.indexOf(e) == -1) return false;
    }
    return true;
}