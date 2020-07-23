import { ShoppingCartItem } from "./shopping-cart-item";
import { Product } from "./product";

export class ShoppingCart{
    items: ShoppingCartItem[] = [];

    constructor(public itemsMap: {[productId:string]: ShoppingCartItem}){
        for (let productId in itemsMap){
            let item = itemsMap[productId];
            this.items.push(new ShoppingCartItem(item.product, item.quantity));
        }
    }

    getQuantity(product: Product){
        console.log(">>>", product);
        let item = this.itemsMap[product.id];
        return item ? item.quantity : 0;
      }

    get totalItemsCount(){
        let count = 0;
        for (let productId in this.itemsMap){
            count += this.itemsMap[productId].quantity;
        }
        return count;
    }

    get totalPrice(){
        let sum = 0;
        for (let productId in this.items){
            sum += this.items[productId].totalPrice;
        }
        return sum;
    }
}