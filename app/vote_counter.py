# Copyright 2008 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

"""A module implementing a simple sharded counter."""


from google.appengine.ext import ndb
import random

NUM_SHARDS = 20
class VoteCounter(ndb.Model):
    votes = ndb.JsonProperty(default={})

def get_shards():
    shards=[]
    for counter in VoteCounter.query():
        shards.append(counter.votes)
    return shards
@ndb.transactional(xg=True)
def reset_opts(opts):
    for i in range(1, NUM_SHARDS+1):
        shard_index=str(i)
        counter = VoteCounter.get_by_id(shard_index)
        if counter is None:
            counter = VoteCounter(id=shard_index)
        counter.votes = opts
        counter.put()
@ndb.transactional
def increment(vote):
    shard_index=str(random.randint(1, NUM_SHARDS))
    counter = VoteCounter.get_by_id(shard_index)
    if vote['id'] == counter.votes['id']:
        if (vote['id']=="mulligan"):
            kept=[vote['opt'],vote['tgt'],vote['sub'],vote['pos']]
            for card in counter.votes['opts']:
                if int(card['id']) in kept:
                    card['votes']+=1
                else:
                    card['votes']-=1
        else:
            for opt in counter.votes['opts']:
                #main option
                if opt['id']==vote['opt']:
                    opt['votes']+=1
                    #check for subvote
                    if vote['sub']!=-1:
                        for subopt in opt['subs']:
                            if subopt['id']==vote['sub']:
                                subopt['votes']+=1
                                if vote['tgt']!=-1:
                                    for tgt in subopt['tgts']:
                                        if tgt['id']==vote['tgt']:
                                            tgt['votes']+=1
                                            break
                                break
                    else:
                        #check for target:
                        if vote['tgt']!=-1:
                            for tgt in opt['tgts']:
                                if tgt['id']==vote['tgt']:
                                    tgt['votes']+=1
                                    break
                    #check for pos
                    if vote['pos']!=-1:
                        for pos in opt['pos']:
                            if pos['pos']==vote['pos']:
                                pos['votes']+=1
                                break
        counter.put()
    else:
        return "WRONG ID"
