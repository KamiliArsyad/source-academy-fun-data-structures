/*
-------------- HELLO --------------------
This is a project to create a doubly linked list data structure using Source language
in Source Academy.

The doubly linked list is defined below. I decided to make it not loop around in the tail:
prevNode(head) is not pointing to the list's tail
and nextNode(tail) is not pointing to the list's head
*/

/*
Triplet Structure: [previous node, item, next node]
*/
const triplet = (x, y, z) => [x, y, z];
const item = triplet => triplet[1];
const prevNode = triplet => triplet[0];
const nextNode = triplet => triplet[2];
const setNext = (triplet, x) => {triplet[2] = x;};
const setItem = (triplet, x) => {triplet[1] = x;};
const setPrev = (triplet, x) => {triplet[0] = x;};


// NOT YET COMPLETED
/*
A doubleList is a triplet whose head (prevNode) is null or a doubleList, and whose
tail (nextNode) is null or a doubleList
*/
function doubleList(lst) {
    function creator(lst, prev) {
        if(is_null(lst)) {
            return null;
        } else {
            const result = triplet(prev, head(lst), null);
            const next = creator(tail(lst), result);
            setNext(result, next);
            
            return result;
        }
    }
    
    return creator(lst, null);
}