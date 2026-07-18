#include <stdio.h>
#include <stdlib.h>
#include <conio.h>

void change()
{
    int index, value;
    printf("Enter index of element to change value of: ");
    scanf("%d", &index);
    printf("Enter new value to assign: ");
    scanf("%d", &value);
    if (index > Top)
    {
        printf("Invalid index! Top is %d", Top);
        exit();
    }
    stack[index] = value;
    printf("Element updated successfully! \n stack[%d]=%d", index, value);
}

void display()
{
    if (Top = -1)
    {
        printf("Stack is emplty!");
        exit()
    }

    for (int i = Top; i > -1; i--)
    {
        printf("\nstack[%d]=%d",index,stack[index]);
    }
}