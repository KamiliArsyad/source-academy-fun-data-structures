/*
-------------- HELLO --------------------
This is a project to create a doubly linked list data structure using Source language
in Source Academy.

The doubly linked list is defined below. I decided to make it not loop around in the tail:
prevNode(head) is not pointing to the list's tail
and nextNode(tail) is not pointing to the list's head
*/

const triplet = (x, y, z) => [x, y, z];
const item = triplet => triplet[1];
const prevNode = triplet => triplet[0];
const nextNode = triplet => triplet[2];
const setNext = (triplet, x) => {triplet[2] = x;};


// NOT YET COMPLETED
/*
A doubleList is a triplet whose head (prevNode) is null or a doubleList, and whose
tail (nextNode) is null or a doubleList
*/
function doubleList(lst) {
    function creator(lst, prev) {
        return is_null(lst)
            ?
            : triplet()
    }
    let head = null;
    let tail = null;
    let result = null;
    
    let pointerList = lst;
    let pointerDList = result;
    
    while(!is_null(pointerList)) {
        result = triplet(result, head(lst), null);
    }
}