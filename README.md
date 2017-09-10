# nodeFlickrTwitter

This nodeJS code uses the Flickr and Twitter APIs to select a random photo from Flickr and post it to Twitter on a daily basis.

### To deploy this solution to AWS Lambda:

1. CD into the project directory
2. Within the directory, ZIP all files into app.zip
3. AWS > Create a new Lambda Function
4. Add CloudWatch Events as a trigger
5. Rules > Create a new rule
    1. Rule name = RunLambdaEveryDay
    2. Rule type = Schedule expression
    3. Schedule Expression = rate(1 day)
    4. Check the box to enable the trigger
    5. Click Next
6. Configure the function
7. Name = nodeFlickrTwitter
8. Runtime = Node.js 6.10
9. Code entry type = Upload a .ZIP file
10. Upload the zipfile containing the application
11. Set the environment varibles for:
    1. Flickr_API (the key for the flickr api)
    2. Twitter_Consumer_Key 
    3. Twitter_Consumer_Secret
    4. Twitter_Access_Token_Key
    5. Twitter_Access_Token_Secret
    6. Flickr_Username (the flickr username to look at for photos)
12. Handler = app.myHandler
13. Role = Create new role from template(s)
14. Role name = nodeFlickrTwitter
15. Expand the Advanced Settings section
    1. Set the timeout to 10 sec
16. Click Next
17. Click Create Function

### To Test:
1. Click Test, the Save and Test (the test data doesn't matter - it's not used). The function should be successful.
