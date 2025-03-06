import React from 'react';

const Tasklist = () => {
  return (
    <div  id='tasklist' className="h-80 w-full items-center mt-10 flex justify-items-start flex-nowrap overflow-x-auto p-7">
      
      {/*First Task*/}
      <div className="h-full w-[30%] flex-shrink-0 bg-[#BD3ACE] gap-8 mr-8 rounded-2xl">
           
           <div className='flex justify-between items-center px-3 py-1'> 

           <h3 className='bg-pink-400 rounded-2xl mr-5 px-2 text-sm'>High</h3>
           <h4>20 feb 2024</h4>
           </div>
            <h2 className='text-2xl px-2 mt-5'>Staples & Grains
            </h2>
            <p className='p-3'>Grains: Wheat, rice, quinoa, oats, barley, cornmeal, rye, millet.

Flours: All-purpose flour, whole wheat flour, almond flour, coconut flour, gluten-free blends.

Pulses & Legumes: Lentils, chickpeas, black beans, kidney beans, split peas.

Pasta/Noodles: Durum wheat pasta, rice noodles, egg noodles, gluten-free options.

</p>
         </div>

              {/*Second Task*/}
         <div className="h-full w-[30%] flex-shrink-0 bg-[#226BAB] gap-8 mr-8 rounded-2xl">
           
           <div className='flex justify-between items-center px-3 py-1'> 

           <h3 className='bg-pink-400 rounded-2xl mr-5 px-2 text-sm'>High</h3>
           <h4>20 feb 2024</h4>
           </div>
            <h2 className='text-2xl px-2 mt-5'>Proteins</h2>
            <p className='p-3'>Meat & Poultry: Chicken, beef, pork, turkey (fresh or frozen).

Seafood: Salmon, shrimp, tuna, cod (fresh, frozen, or canned).

Plant-Based: Tofu, tempeh, seitan, pea protein, textured vegetable protein (TVP).

Eggs & Dairy Proteins: Liquid eggs, egg whites, whey protein, casein.</p>
         </div>

           {/*Third Task*/}
         <div className="h-full w-[30%] flex-shrink-0 bg-[#A02575] gap-8 mr-8 rounded-2xl">
           
           <div className='flex justify-between items-center px-3 py-1'> 

           <h3 className='bg-pink-400 rounded-2xl mr-5 px-2 text-sm'>High</h3>
           <h4>20 feb 2024</h4>
           </div>
            <h2 className='text-2xl px-2 mt-5'>  Dairy & Alternatives</h2>
            <p className='p-3'>Milk & Cream: Whole milk, skim milk, heavy cream, condensed milk.

Cheese: Cheddar, mozzarella, Parmesan, cream cheese, vegan cheese.

Yogurt: Greek yogurt, plant-based yogurts (almond, coconut, soy).

Butter & Margarine: Salted/unsalted butter, vegan butter.</p>
         </div>

           {/*Fourth Task*/}
         <div className="h-full w-[30%] flex-shrink-0 bg-[#13B8D9] gap-8 mr-8 rounded-2xl">
           
           <div className='flex justify-between items-center px-3 py-1'> 

           <h3 className='bg-pink-400 rounded-2xl mr-5 px-2 text-sm'>High</h3>
           <h4>20 feb 2024</h4>
           </div>
            <h2 className='text-2xl px-2 mt-5'> Fats & Oils</h2>
            <p className='p-3'>Cooking oils (olive, sunflower, coconut, avocado, canola).

               Ghee, lard, shortening.

             Specialty oils (sesame, truffle, flavored oils).</p>
         </div>

           {/*Fifth Task*/}
         <div className="h-full w-[30%] flex-shrink-0 bg-[#D9D313] gap-8 mr-8 rounded-2xl">
           
           <div className='flex justify-between items-center px-3 py-1'> 

           <h3 className='bg-pink-400 rounded-2xl mr-5 px-2 text-sm'>High</h3>
           <h4>20 feb 2024</h4>
           </div>
            <h2 className='text-2xl px-2 mt-5'> Fruits & Vegetables</h2>
            <p className='p-3'>Fresh: Apples, berries, citrus, tomatoes, leafy greens, root vegetables.

         Frozen: Mixed vegetables, fruit blends, diced onions/garlic.

         Canned/Jarred: Tomatoes, pineapple, olives, pickles, artichokes.

         Dried: Raisins, apricots, cranberries, sun-dried tomatoes.</p>
         </div>

     
    </div>
  );
};

export default Tasklist;
