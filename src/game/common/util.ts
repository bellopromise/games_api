export const CONSTANTS = {
    startMonths: 12,
    endMonths: 18,
    discount: 0.2
}

export const Messages = {
    errorInvalidId: "ID provided is not a valid ObjectId.",
    errorUpdateGame: "Failed to update game. Please check the request payload",
    errorGameNotFound: "Game not found.",
    errorGamesNotFound: "Game(s) not found.",
    successGameRemoved: "Game removed successfully."
}

export const  calculateDiscount = (price: number, percentage: number): number=>{
    return price - (price*percentage);
  }