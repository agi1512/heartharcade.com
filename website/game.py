import os
import jinja2
import webapp2
import base64
import json
import vote_counter

JINJA_ENVIRONMENT = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
    extensions=['jinja2.ext.autoescape'],
    autoescape=True)

class MainPage(webapp2.RequestHandler):

    def get(self):

        template_values = {
            'copyright': 'Copyright &copy; HearthArcade, 2015. All copyrighted images and content are property of Blizzard Entertainment, Inc. <a href="http://playhearthstone.com">Click here</a> to play Hearthstone!',
            }

        template = JINJA_ENVIRONMENT.get_template('game.html')
        self.response.write(template.render(template_values))

class Goals(webapp2.RequestHandler):

    def get(self):

        template_values = {
            'copyright': 'Copyright &copy; HearthArcade, 2015. All copyrighted images and content are property of Blizzard Entertainment, Inc. <a href="http://playhearthstone.com">Click here</a> to play Hearthstone!',
            }

        template = JINJA_ENVIRONMENT.get_template('goals.html')
        self.response.write(template.render(template_values))

class VoteCounter(webapp2.RequestHandler):

    def get(self):
        key = self.request.get('key')
        if (key=='q$5T>zqbQ=\?t(H'):
            shards = vote_counter.get_shards()
            template=shards[0]['opts']
            for shard in shards[1:]:
                for index, option in enumerate(shard['opts']):
                    #Add up option votes
                    template[index]['votes']+=option['votes']
                    try:
                        #If there are Suboptions
                        for subindex, suboption in enumerate(option['subs']):
                            #Add up suboption votes
                            template[index]['subs'][subindex]['votes']+=suboption['votes']
                            try:
                                #If the suboption has targets
                                for tgtindex, tgt in enumerate(suboption['tgts']):
                                    #Add up suboption target votes
                                    template[index]['subs'][subindex]['tgts'][tgtindex]['votes']+=tgt['votes']
                            except:
                                pass
                    except:
                        #If there are no suboptions check for targets
                        try:
                            for tgtindex, tgt in enumerate(option['tgts']):
                               #Add up target votes
                                template[index]['tgts'][tgtindex]['votes']+=tgt['votes']
                        except:
                            pass
                    try:
                        #If there are positions
                        for posindex, pos in enumerate(option['pos']):
                            #Add up pos votes
                            template[index]['pos'][posindex]['votes']+=pos['votes']
                    except:
                        pass
            if shards[0]['id']=='mulligan':
                jsonwinner = json.dumps(template)
            else:
                seq = [opt['votes'] for opt in template]
                winner=template[seq.index(max(seq))]
                execute={}
                execute['opt']=winner['id']
                try:
                    seq = [sub['votes'] for sub in winner['subs']]
                    winsub=winner['subs'][seq.index(max(seq))]
                    execute['sub'] = winsub['id']
                    try:
                        seq = [tgt['votes'] for tgt in winsub['tgts']]
                        execute['tgt']=winsub['tgts'][seq.index(max(seq))]['id']
                    except:
                        pass
                except:
                    try:
                        seq = [tgt['votes'] for tgt in winner['tgts']]
                        execute['tgt']=winner['tgts'][seq.index(max(seq))]['id']
                    except:
                        pass
                try:
                    seq = [pos['votes'] for pos in winner['pos']]
                    execute['pos']=winner['pos'][seq.index(max(seq))]['pos']
                except:
                    pass
                jsonwinner = json.dumps(execute)
            self.response.write(jsonwinner)
        else:
            self.response.write(key)


    def post(self):
        key = self.request.get('key')
        if (key=='q$5T>zqbQ=\?t(H'):
            opts = json.loads(base64.b64decode(self.request.get('opts')))
            vote_counter.reset_opts(opts)
            self.response.write("OK")
        else:
            self.response.write(key)
class Shard(webapp2.RequestHandler):
    def get(self):
        key = self.request.get('key')
        if (key=='q$5T>zqbQ=\?t(H'):
            shards = vote_counter.get_shards()
            jsonshards=[]
            for shard in shards:
                jsonshards.append(json.dumps(shard))
            template=shards[0]['opts']
            for shard in shards[1:]:
                for index, option in enumerate(shard['opts']):
                    #Add up option votes
                    template[index]['votes']+=option['votes']
                    try:
                        #If there are Suboptions
                        for subindex, suboption in enumerate(option['subs']):
                            #Add up suboption votes
                            template[index]['subs'][subindex]['votes']+=suboption['votes']
                            try:
                                #If the suboption has targets
                                for tgtindex, tgt in enumerate(suboption['tgts']):
                                    #Add up suboption target votes
                                    template[index]['subs'][subindex]['tgts'][tgtindex]['votes']+=tgt['votes']
                            except:
                                pass
                    except:
                        #If there are no suboptions check for targets
                        try:
                            for tgtindex, tgt in enumerate(option['tgts']):
                               #Add up target votes
                                template[index]['tgts'][tgtindex]['votes']+=tgt['votes']
                        except:
                            pass
                    try:
                        #If there are positions
                        for posindex, pos in enumerate(option['pos']):
                            #Add up pos votes
                            template[index]['pos'][posindex]['votes']+=pos['votes']
                    except:
                        pass
            total=json.dumps(template)
            htmltemplate = JINJA_ENVIRONMENT.get_template('shard.html')
            self.response.write(htmltemplate.render({'shards': jsonshards, 'total': total}))

        else:
            self.response.write(key);

class Vote(webapp2.RequestHandler):
    def post(self):
        vote = json.loads(base64.b64decode(self.request.get('vote')))
        response=vote_counter.increment(vote)
        self.response.write(response)

application = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/votes', VoteCounter),
    ('/goals', Goals),
    ('/vote', Vote),
    ('/shard', Shard),

], debug=True)