# Welcome to almost done exercise done by me, Future Teammate!

I appreciate the opportunity to develop this challenge, I found it really interesting in the sense that I really felt tested from the point of view on how I work, I would deliver, how I would help teach others, how would I document, how I can prove my trade-off analysis skilss. I hope you guys enjoy reviewin this as much as I enjoyed developing. 

# Thoughts

I just wanted to briefly leave some comments here on how I tackle it and what I found

- I had trouble trying to serve the Docker container with VS Code. I was looking at the errors and somehow a variable (ID i think it was ) was not correctly passed down, so I decided to run the ./run.sh file in my terminal directly, it worked after that.
- I started all challenges by trying to stick to the requirements as much as possible but to make sure time could help me ( even though you stated it might not be possible, I always looked for it to be possible ). I started by reading evrything making sure I understood the most part of the whole idea.
- When fixing the filter, or adding it, I thought that since API is not configured/written to receive parameters in that endpoint I might as well do it in the frontend, showcasing how I would takle the exercise rapidly and with order. Bottom line is, I would do it from the backend, making sure I only send the filter parameter so i receive a filtered resposne. However, i did it in the frontend, noting this is not scalable and it doesnt justify to add load to the customers interaction
- Fixing the render issue proved to be quickly, I saw that our component was render again because its parent execute a render, memoizing made sure that rendering again would only happen in the case data from that component changed. I also saw that in ever render the APP component was passing a new function to Header, so i used useCallback to make sure it was not calculated again, we didn't have any more renderse
- For the 3rd exercise I tried to eat the ( we say it this way in spanish ) elephant by pieces. I tried to start by a static render, simple api call, and building on top of that for sorting and pagination. I used the several local variables to manage that state, it proved to be a little bit time costing since I wanted to have a really good component
- For the 4th exercise I didn't have much time, I will though create later commits, if you're interested in looking at them after 1:10PM ET


I appreciate the feedback, I would love to hear your thoughts and I expect to continue talking to you guys and going to next step


Cheers 🍻
