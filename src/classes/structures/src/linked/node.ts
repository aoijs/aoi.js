export  class Node
{
    element: unknown;
    next: Node | null;
    constructor ( element: unknown )
    {
        this.element = element;
        this.next = null;
    }
}